package com.toastacs.api.domain.gate;

import com.toastacs.api.domain.alert.AlertService;
import com.toastacs.api.domain.alert.AlertType;
import com.toastacs.api.domain.entry.Direction;
import com.toastacs.api.domain.gate.dto.GatePollRequest;
import com.toastacs.api.domain.gate.dto.GatePollResponse;
import com.toastacs.api.domain.gate.dto.GateStatus;
import com.toastacs.api.domain.pass.SeatService;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GateStateService {

    private static final short GATE_ROW_ID = 1;
    private static final Duration PRESENCE_WINDOW = Duration.ofSeconds(2);
    private static final Duration OFFLINE_THRESHOLD = Duration.ofSeconds(5);
    private static final Duration TAILGATE_OPEN_WINDOW = Duration.ofSeconds(10);
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final GateStateRepository gateStateRepository;
    private final AlertService alertService;
    private final SeatService seatService;
    private final Clock clock;

    private final AtomicBoolean offlineAlerted = new AtomicBoolean(false);
    private final AtomicReference<Instant> lastOpenConsumedAt = new AtomicReference<>();

    @Transactional
    public GatePollResponse poll(GatePollRequest request) {
        GateState state = loadState();
        Instant now = clock.instant();
        state.heartbeat(now);
        offlineAlerted.set(false);
        if (request.ultrasonicIn()) {
            state.detectPresence(Direction.IN, now);
        }
        if (request.ultrasonicOut()) {
            state.detectPresence(Direction.OUT, now);
        }
        boolean openIn = state.consumeOpen(Direction.IN);
        boolean openOut = state.consumeOpen(Direction.OUT);
        boolean alarm = state.consumeAlarm();
        String seat = state.consumeSeat();
        String denyIn = state.consumeDeny(Direction.IN);
        String denyOut = state.consumeDeny(Direction.OUT);
        if (openIn || openOut) {
            lastOpenConsumedAt.set(now);
        }
        handlePassedCount(request.passedCount(), now);
        return new GatePollResponse(openIn, openOut, alarm, openIn ? seat : null,
                seatService.occupancyMask(), denyIn, denyOut);
    }

    @Transactional(readOnly = true)
    public boolean isPresenceDetected(Direction direction) {
        Instant ultrasonicAt = loadState().getUltrasonicAt(direction);
        return ultrasonicAt != null
                && Duration.between(ultrasonicAt, clock.instant()).compareTo(PRESENCE_WINDOW) <= 0;
    }

    @Transactional
    public void queueOpen(Direction direction, String seat) {
        loadState().queueOpen(direction, seat);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notifyDenied(ErrorCode code, Direction direction) {
        String label = GateDenyLabels.labelFor(code);
        if (label == null) {
            return;
        }
        GateState state = loadState();
        if (GateDenyLabels.isDirectional(code) && direction != null) {
            state.queueDeny(direction, label);
        } else {
            state.queueDeny(Direction.IN, label);
            state.queueDeny(Direction.OUT, label);
        }
    }

    @Transactional(readOnly = true)
    public GateStatus status() {
        Instant lastSeenAt = loadState().getLastSeenAt();
        boolean online = lastSeenAt != null
                && Duration.between(lastSeenAt, clock.instant()).compareTo(OFFLINE_THRESHOLD) <= 0;
        return new GateStatus(online, lastSeenAt == null ? null : lastSeenAt.atZone(KST).toOffsetDateTime());
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional(readOnly = true)
    public void detectOffline() {
        Instant lastSeenAt = loadState().getLastSeenAt();
        if (lastSeenAt == null) {
            return;
        }
        boolean offline = Duration.between(lastSeenAt, clock.instant()).compareTo(OFFLINE_THRESHOLD) > 0;
        if (offline && offlineAlerted.compareAndSet(false, true)) {
            alertService.raise(AlertType.GATE_OFFLINE, "게이트가 5초 이상 응답하지 않습니다.");
        }
    }

    private void handlePassedCount(int passedCount, Instant now) {
        if (passedCount <= 0) {
            return;
        }
        Instant openedAt = lastOpenConsumedAt.get();
        boolean recentlyOpened = openedAt != null
                && Duration.between(openedAt, now).compareTo(TAILGATE_OPEN_WINDOW) <= 0;
        if (!recentlyOpened) {
            alertService.raise(AlertType.UNAUTH_APPROACH,
                    "개방 없이 %d명이 게이트를 통과했습니다.".formatted(passedCount));
        } else if (passedCount >= 2) {
            alertService.raise(AlertType.TAILGATE,
                    "1회 개방에 %d명이 통과했습니다.".formatted(passedCount));
        }
    }

    private GateState loadState() {
        return gateStateRepository.findById(GATE_ROW_ID)
                .orElseThrow(() -> new IllegalStateException("gate_state 단일 행이 없습니다."));
    }
}

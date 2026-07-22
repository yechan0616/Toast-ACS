package com.toastacs.api.domain.entry;

import com.toastacs.api.domain.entry.dto.EntryOutcome;
import com.toastacs.api.domain.entry.dto.EntryResponse;
import com.toastacs.api.domain.gate.GateStateService;
import com.toastacs.api.domain.pass.Pass;
import com.toastacs.api.domain.pass.PassService;
import com.toastacs.api.domain.session.DeviceSessionService;
import com.toastacs.api.domain.session.dto.VerifiedSession;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EntryService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final DeviceSessionService deviceSessionService;
    private final PassService passService;
    private final GateStateService gateStateService;
    private final EntryLogRepository entryLogRepository;

    public EntryOutcome attempt(String token, Direction direction) {
        if (token == null || token.isBlank()) {
            throw deny(null, direction, ErrorCode.SESSION_REQUIRED);
        }
        VerifiedSession verified = null;
        try {
            verified = deviceSessionService.verify(token);
            deviceSessionService.ensureActive(verified.session());
            Pass pass = verified.session().getPass();
            if (direction == Direction.IN && pass.isInside()) {
                throw new ApiException(ErrorCode.ALREADY_INSIDE);
            }
            if (direction == Direction.OUT && !pass.isInside()) {
                throw new ApiException(ErrorCode.NOT_INSIDE);
            }
            if (!gateStateService.isPresenceDetected(direction)) {
                throw new ApiException(ErrorCode.NO_PRESENCE);
            }
            deviceSessionService.claimWindow(verified);
        } catch (ApiException e) {
            Long passId = verified == null ? null : verified.session().getPass().getId();
            Long sessionId = verified == null ? null : verified.session().getId();
            throw deny(passId, direction, e.getErrorCode(), sessionId);
        }

        passService.applyEntry(verified.session().getPass().getId(), direction);
        gateStateService.queueOpen(direction,
                direction == Direction.IN ? verified.session().getPass().getSeat() : null);
        entryLogRepository.save(EntryLog.allowed(
                verified.session().getPass().getId(), verified.session().getId(), direction));
        return new EntryOutcome(
                deviceSessionService.reissueCookie(verified.session()),
                new EntryResponse(EntryResult.ALLOWED.name(), OffsetDateTime.now(KST)));
    }

    @Transactional(readOnly = true)
    public Page<EntryLog> logs(EntryResult result, Pageable pageable) {
        return entryLogRepository.findByResultOrderByCreatedAtDesc(result, pageable);
    }

    @Transactional(readOnly = true)
    public long countTodaySince(EntryResult result, Instant from) {
        return entryLogRepository.countByResultAndCreatedAtGreaterThanEqual(result, from);
    }

    @Transactional(readOnly = true)
    public long countTotal(EntryResult result) {
        return entryLogRepository.countByResult(result);
    }

    @Transactional(readOnly = true)
    public Map<Long, Long> countBySessions(Collection<Long> sessionIds, EntryResult result) {
        if (sessionIds.isEmpty()) {
            return Map.of();
        }
        return entryLogRepository.countByResultGroupedBySession(result, sessionIds).stream()
                .collect(Collectors.toMap(
                        EntryLogRepository.SessionEntryCount::getSessionId,
                        EntryLogRepository.SessionEntryCount::getCount));
    }

    private ApiException deny(Long passId, Direction direction, ErrorCode code) {
        return deny(passId, direction, code, null);
    }

    private ApiException deny(Long passId, Direction direction, ErrorCode code, Long sessionId) {
        entryLogRepository.save(EntryLog.denied(passId, sessionId, direction, code));
        gateStateService.notifyDenied(code, direction);
        return new ApiException(code);
    }
}

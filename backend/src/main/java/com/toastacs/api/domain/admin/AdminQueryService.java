package com.toastacs.api.domain.admin;

import com.toastacs.api.domain.admin.dto.AlertItem;
import com.toastacs.api.domain.admin.dto.LogItem;
import com.toastacs.api.domain.admin.dto.LogType;
import com.toastacs.api.domain.admin.dto.OverviewResponse;
import com.toastacs.api.domain.admin.dto.PageResponse;
import com.toastacs.api.domain.admin.dto.SessionItem;
import com.toastacs.api.domain.alert.Alert;
import com.toastacs.api.domain.alert.AlertService;
import com.toastacs.api.domain.entry.Direction;
import com.toastacs.api.domain.entry.EntryLog;
import com.toastacs.api.domain.entry.EntryResult;
import com.toastacs.api.domain.entry.EntryService;
import com.toastacs.api.domain.gate.GateStateService;
import com.toastacs.api.domain.pass.PassRequestService;
import com.toastacs.api.domain.pass.PassService;
import com.toastacs.api.domain.session.DeviceSession;
import com.toastacs.api.domain.session.DeviceSessionService;
import com.toastacs.api.domain.session.SessionKillLog;
import com.toastacs.api.domain.session.SessionKillLogRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminQueryService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final PassService passService;
    private final PassRequestService passRequestService;
    private final DeviceSessionService deviceSessionService;
    private final EntryService entryService;
    private final GateStateService gateStateService;
    private final AlertService alertService;

    public OverviewResponse overview() {
        Instant startOfToday = startOfToday();
        List<SessionKillLogRepository.KillCountByPass> suspected =
                deviceSessionService.suspectedSince(startOfToday);
        Map<Long, String> codes = passService.codesByIds(
                suspected.stream().map(SessionKillLogRepository.KillCountByPass::getPassId).toList());
        return new OverviewResponse(
                passService.countInside(),
                deviceSessionService.countActive(),
                passRequestService.countPending(),
                entryService.countTotal(EntryResult.ALLOWED),
                gateStateService.status(),
                new OverviewResponse.TodayStats(
                        entryService.countTodaySince(EntryResult.ALLOWED, startOfToday),
                        entryService.countTodaySince(EntryResult.DENIED, startOfToday),
                        deviceSessionService.countKillsSince(startOfToday),
                        alertService.countSince(startOfToday)),
                suspected.stream()
                        .map(s -> new OverviewResponse.SuspectedPass(codes.get(s.getPassId()), s.getKills()))
                        .toList());
    }

    public PageResponse<LogItem> logs(LogType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return switch (type) {
            case ENTRY -> toEntryLogPage(entryService.logs(EntryResult.ALLOWED, pageable));
            case DENIED -> toEntryLogPage(entryService.logs(EntryResult.DENIED, pageable));
            case SESSION_KILL -> toKillLogPage(deviceSessionService.killLogs(pageable));
        };
    }

    public PageResponse<AlertItem> alerts(int page, int size) {
        Page<Alert> alerts = alertService.alerts(PageRequest.of(page, size));
        List<AlertItem> content = alerts.getContent().stream()
                .map(alert -> new AlertItem(alert.getId(), alert.getType().name(), alert.getDetail(),
                        toKst(alert.getCreatedAt())))
                .toList();
        return PageResponse.of(alerts, content);
    }

    public PageResponse<SessionItem> sessions(int page, int size) {
        Page<DeviceSession> sessions = deviceSessionService.activeSessions(PageRequest.of(page, size));
        List<Long> sessionIds = sessions.getContent().stream().map(DeviceSession::getId).toList();
        Map<Long, Long> entryCounts = entryService.countBySessions(sessionIds, EntryResult.ALLOWED);
        List<SessionItem> content = sessions.getContent().stream()
                .map(session -> new SessionItem(session.getId(), session.getPass().getCode(),
                        session.getUserAgent(), toKst(session.getCreatedAt()),
                        entryCounts.getOrDefault(session.getId(), 0L)))
                .toList();
        return PageResponse.of(sessions, content);
    }

    public void openGate() {
        gateStateService.queueOpen(Direction.IN, null);
        gateStateService.queueOpen(Direction.OUT, null);
    }

    private PageResponse<LogItem> toEntryLogPage(Page<EntryLog> logs) {
        Map<Long, String> codes = passService.codesByIds(
                logs.getContent().stream().map(EntryLog::getPassId).toList());
        List<LogItem> content = logs.getContent().stream()
                .map(log -> new LogItem(log.getId(), codes.get(log.getPassId()),
                        log.getDirection().name(), log.getResult().name(), log.getDenyCode(),
                        toKst(log.getCreatedAt())))
                .toList();
        return PageResponse.of(logs, content);
    }

    private PageResponse<LogItem> toKillLogPage(Page<SessionKillLog> logs) {
        Map<Long, String> codes = passService.codesByIds(
                logs.getContent().stream().map(SessionKillLog::getPassId).toList());
        List<LogItem> content = logs.getContent().stream()
                .map(log -> new LogItem(log.getId(), codes.get(log.getPassId()),
                        null, "SESSION_KILL", null, toKst(log.getCreatedAt())))
                .toList();
        return PageResponse.of(logs, content);
    }

    private Instant startOfToday() {
        return LocalDate.now(KST).atStartOfDay(KST).toInstant();
    }

    private OffsetDateTime toKst(Instant instant) {
        return instant == null ? null : instant.atZone(KST).toOffsetDateTime();
    }
}

package com.toastacs.api.domain.session;

import com.toastacs.api.domain.alert.AlertService;
import com.toastacs.api.domain.alert.AlertType;
import com.toastacs.api.domain.pass.Pass;
import com.toastacs.api.domain.session.dto.IssuedSession;
import com.toastacs.api.domain.session.dto.VerifiedSession;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HexFormat;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceSessionService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final int SHARE_SUSPECT_KILL_THRESHOLD = 3;

    private final DeviceSessionRepository deviceSessionRepository;
    private final SessionKillLogRepository sessionKillLogRepository;
    private final AlertService alertService;
    private final TokenSigner tokenSigner;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public IssuedSession issue(Pass pass, String userAgent) {
        deviceSessionRepository.findByPassIdAndRevokedAtIsNull(pass.getId())
                .ifPresent(existing -> {
                    killAndRecord(existing, pass);
                    deviceSessionRepository.flush();
                });
        DeviceSession session = deviceSessionRepository.save(
                DeviceSession.create(pass, generateSecret(), userAgent));
        return new IssuedSession(session, tokenSigner.issue(session.getId(), session.getSecret()));
    }

    @Transactional
    public void killActiveSessions(Pass pass) {
        deviceSessionRepository.findByPassIdAndRevokedAtIsNull(pass.getId())
                .ifPresent(existing -> killAndRecord(existing, pass));
    }

    @Transactional(readOnly = true)
    public VerifiedSession verify(String token) {
        long sessionId = tokenSigner.extractSessionId(token);
        DeviceSession session = deviceSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ApiException(ErrorCode.TOKEN_EXPIRED));
        long window = tokenSigner.verify(token, session.getSecret());
        return new VerifiedSession(session, window);
    }

    @Transactional(readOnly = true)
    public VerifiedSession authenticate(String token) {
        if (token == null || token.isBlank()) {
            throw new ApiException(ErrorCode.SESSION_REQUIRED);
        }
        VerifiedSession verified = verify(token);
        ensureActive(verified.session());
        return verified;
    }

    @Transactional
    public void claimWindow(VerifiedSession verified) {
        int updated = deviceSessionRepository.claimWindow(
                verified.session().getId(), verified.window());
        if (updated == 0) {
            throw new ApiException(ErrorCode.TOKEN_REUSED);
        }
    }

    public void ensureActive(DeviceSession session) {
        if (session.isRevoked()) {
            throw new ApiException(ErrorCode.SESSION_KILLED);
        }
    }

    public String reissueCookie(DeviceSession session) {
        return tokenSigner.issue(session.getId(), session.getSecret());
    }

    @Transactional(readOnly = true)
    public long countActive() {
        return deviceSessionRepository.countByRevokedAtIsNull();
    }

    @Transactional(readOnly = true)
    public Page<SessionKillLog> killLogs(Pageable pageable) {
        return sessionKillLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public Page<DeviceSession> activeSessions(Pageable pageable) {
        return deviceSessionRepository.findActiveWithPass(pageable);
    }

    @Transactional(readOnly = true)
    public long countKillsSince(Instant from) {
        return sessionKillLogRepository.countByCreatedAtGreaterThanEqual(from);
    }

    @Transactional(readOnly = true)
    public List<SessionKillLogRepository.KillCountByPass> suspectedSince(Instant from) {
        return sessionKillLogRepository.countKillsByPassSince(from, SHARE_SUSPECT_KILL_THRESHOLD);
    }

    private void killAndRecord(DeviceSession existing, Pass pass) {
        existing.kill();
        sessionKillLogRepository.save(SessionKillLog.of(pass.getId(), existing.getId()));
        Instant startOfToday = LocalDate.now(KST).atStartOfDay(KST).toInstant();
        long killsToday = sessionKillLogRepository.countByPassIdAndCreatedAtGreaterThanEqual(pass.getId(), startOfToday);
        if (killsToday >= SHARE_SUSPECT_KILL_THRESHOLD) {
            alertService.raise(AlertType.SHARE_SUSPECT,
                    "이용권 %s에서 오늘 %d번째 기기 교체가 발생했습니다.".formatted(pass.getCode(), killsToday));
        }
    }

    private String generateSecret() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }
}

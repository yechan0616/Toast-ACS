package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.entry.Direction;
import com.toastacs.api.domain.entry.EntryLogRepository;
import com.toastacs.api.domain.entry.EntryResult;
import com.toastacs.api.domain.pass.dto.ActivateResponse;
import com.toastacs.api.domain.pass.dto.ActivationResult;
import com.toastacs.api.domain.pass.dto.MeResponse;
import com.toastacs.api.domain.pass.dto.MeResult;
import com.toastacs.api.domain.session.DeviceSessionService;
import com.toastacs.api.domain.session.dto.IssuedSession;
import com.toastacs.api.domain.session.dto.VerifiedSession;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PassService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");

    private final PassRepository passRepository;
    private final DeviceSessionService deviceSessionService;
    private final EntryLogRepository entryLogRepository;
    private final String serviceName;
    private final String gateName;

    public PassService(PassRepository passRepository, DeviceSessionService deviceSessionService,
            EntryLogRepository entryLogRepository,
            @Value("${acs.service-name}") String serviceName, @Value("${acs.gate-name}") String gateName) {
        this.passRepository = passRepository;
        this.deviceSessionService = deviceSessionService;
        this.entryLogRepository = entryLogRepository;
        this.serviceName = serviceName;
        this.gateName = gateName;
    }

    @Transactional
    public ActivationResult activate(String code, String userAgent, String deviceToken) {
        Pass pass = passRepository.findByCode(code)
                .orElseThrow(() -> new ApiException(ErrorCode.PASS_NOT_FOUND));
        if (pass.isRevoked()) {
            throw new ApiException(ErrorCode.PASS_REVOKED,
                    "%s\n사유: %s".formatted(ErrorCode.PASS_REVOKED.getMessage(), pass.getRevokeReason()));
        }
        if (pass.isExpired(Instant.now())) {
            throw new ApiException(ErrorCode.PASS_EXPIRED);
        }
        if (pass.isBoundToOtherDevice(deviceToken)) {
            throw new ApiException(ErrorCode.DEVICE_MISMATCH);
        }
        IssuedSession issued = deviceSessionService.issue(pass, userAgent);
        return new ActivationResult(issued.cookieValue(),
                new ActivateResponse(pass.getType().name(), toKst(pass.getExpiresAt())));
    }

    @Transactional(readOnly = true)
    public MeResult me(String token) {
        VerifiedSession verified = deviceSessionService.authenticate(token);
        Pass pass = verified.session().getPass();
        long entryCount = entryLogRepository.countByPassIdAndResult(pass.getId(), EntryResult.ALLOWED);
        return new MeResult(deviceSessionService.reissueCookie(verified.session()),
                new MeResponse(serviceName, gateName, pass.getType().name(), toKst(pass.getExpiresAt()),
                        pass.isInside(), entryCount));
    }

    @Transactional
    public void revoke(String code, String reason) {
        Pass pass = passRepository.findByCode(code)
                .orElseThrow(() -> new ApiException(ErrorCode.PASS_NOT_FOUND));
        pass.revoke(reason);
        deviceSessionService.killActiveSessions(pass);
    }

    @Transactional
    public void applyEntry(Long passId, Direction direction) {
        Pass pass = passRepository.findById(passId)
                .orElseThrow(() -> new ApiException(ErrorCode.PASS_NOT_FOUND));
        if (direction == Direction.IN) {
            pass.enter();
        } else {
            pass.exit();
        }
    }

    @Transactional(readOnly = true)
    public long countInside() {
        return passRepository.countByInsideTrue();
    }

    @Transactional(readOnly = true)
    public Map<Long, String> codesByIds(Collection<Long> passIds) {
        List<Long> ids = passIds.stream().filter(id -> id != null).distinct().toList();
        if (ids.isEmpty()) {
            return Map.of();
        }
        return passRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(Pass::getId, Pass::getCode));
    }

    private OffsetDateTime toKst(Instant instant) {
        return instant.atZone(KST).toOffsetDateTime();
    }
}

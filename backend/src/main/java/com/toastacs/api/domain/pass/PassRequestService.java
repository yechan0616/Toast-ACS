package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.admin.dto.PageResponse;
import com.toastacs.api.domain.pass.dto.PassRequestApproveResponse;
import com.toastacs.api.domain.pass.dto.PassRequestCreateRequest;
import com.toastacs.api.domain.pass.dto.PassRequestCreateResponse;
import com.toastacs.api.domain.pass.dto.PassRequestCreateResult;
import com.toastacs.api.domain.pass.dto.PassRequestItem;
import com.toastacs.api.domain.pass.dto.PassRequestStatusResponse;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PassRequestService {

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_GROUP_LENGTH = 4;

    private final PassRequestRepository passRequestRepository;
    private final PassRepository passRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public PassRequestCreateResult request(PassRequestCreateRequest request, String ip) {
        PassRequest saved = passRequestRepository.save(PassRequest.create(
                request.applicantName().trim(), request.phone().trim(), ip, normalize(request.reason())));
        return new PassRequestCreateResult(saved.getDeviceToken(),
                new PassRequestCreateResponse(saved.getPublicId()));
    }

    @Transactional(readOnly = true)
    public PassRequestStatusResponse status(UUID requestId) {
        PassRequest request = findByPublicId(requestId);
        return switch (request.getStatus()) {
            case PENDING -> PassRequestStatusResponse.pending(request.getStatus().name());
            case REJECTED -> PassRequestStatusResponse.rejected(request.getStatus().name(),
                    request.getRejectReason());
            case APPROVED -> new PassRequestStatusResponse(request.getStatus().name(),
                    request.getPass().getCode(), request.getPass().getType().name(),
                    toKst(request.getPass().getExpiresAt()), null);
        };
    }

    @Transactional
    public PassRequestApproveResponse approve(UUID requestId, PassType passType) {
        PassRequest request = findByPublicId(requestId);
        Pass pass = Pass.create(generateUniqueCode(), passType, calculateExpiresAt(passType));
        request.approve(pass);
        passRepository.save(pass);
        return new PassRequestApproveResponse(pass.getCode(), toKst(pass.getExpiresAt()));
    }

    @Transactional
    public void reject(UUID requestId, String reason) {
        findByPublicId(requestId).reject(normalize(reason));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    @Transactional(readOnly = true)
    public long countPending() {
        return passRequestRepository.countByStatus(PassRequestStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public PageResponse<PassRequestItem> list(PassRequestStatus status, int page, int size) {
        Page<PassRequest> requests =
                passRequestRepository.findAllByStatusOrderByCreatedAtDesc(status, PageRequest.of(page, size));
        List<PassRequestItem> content = requests.getContent().stream()
                .map(request -> new PassRequestItem(request.getPublicId(), request.getApplicantName(),
                        request.getPhone(),
                        request.getPassType() == null ? null : request.getPassType().name(),
                        request.getIp(), request.getReason(), request.getStatus().name(),
                        request.getPass() == null ? null : request.getPass().getCode(),
                        request.getRejectReason(), toKst(request.getCreatedAt()), toKst(request.getDecidedAt())))
                .toList();
        return PageResponse.of(requests, content);
    }

    private PassRequest findByPublicId(UUID requestId) {
        return passRequestRepository.findByPublicId(requestId)
                .orElseThrow(() -> new ApiException(ErrorCode.REQUEST_NOT_FOUND));
    }

    private Instant calculateExpiresAt(PassType type) {
        Instant now = Instant.now();
        return type == PassType.TIME ? now.plus(24, ChronoUnit.HOURS) : now.plus(30, ChronoUnit.DAYS);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = randomCode();
        } while (passRepository.existsByCode(code));
        return code;
    }

    private String randomCode() {
        StringBuilder builder = new StringBuilder(CODE_GROUP_LENGTH * 2 + 1);
        for (int i = 0; i < CODE_GROUP_LENGTH * 2; i++) {
            if (i == CODE_GROUP_LENGTH) {
                builder.append('-');
            }
            builder.append(CODE_ALPHABET.charAt(secureRandom.nextInt(CODE_ALPHABET.length())));
        }
        return builder.toString();
    }

    private OffsetDateTime toKst(Instant instant) {
        return instant == null ? null : instant.atZone(KST).toOffsetDateTime();
    }
}

package com.toastacs.api.domain.pass.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record PassRequestItem(UUID requestId, String applicantName, String phone, String passType, String seat,
                              String ip, String reason, String status, String passCode, String rejectReason,
                              OffsetDateTime createdAt, OffsetDateTime decidedAt) {
}

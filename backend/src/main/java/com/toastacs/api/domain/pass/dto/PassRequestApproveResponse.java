package com.toastacs.api.domain.pass.dto;

import java.time.OffsetDateTime;

public record PassRequestApproveResponse(String code, OffsetDateTime expiresAt) {
}

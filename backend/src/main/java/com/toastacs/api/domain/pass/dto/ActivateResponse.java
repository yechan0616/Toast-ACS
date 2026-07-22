package com.toastacs.api.domain.pass.dto;

import java.time.OffsetDateTime;

public record ActivateResponse(String passType, OffsetDateTime expiresAt, String seat) {
}

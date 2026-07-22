package com.toastacs.api.domain.pass.dto;

import java.time.OffsetDateTime;

public record MeResponse(String serviceName, String gateName, String passType, OffsetDateTime expiresAt,
                         boolean inside, long entryCount, String seat) {
}

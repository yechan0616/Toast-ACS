package com.toastacs.api.domain.admin.dto;

import java.time.OffsetDateTime;

public record AlertItem(Long id, String type, String detail, OffsetDateTime createdAt) {
}

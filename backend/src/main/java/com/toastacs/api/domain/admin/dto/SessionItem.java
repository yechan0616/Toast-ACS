package com.toastacs.api.domain.admin.dto;

import java.time.OffsetDateTime;

public record SessionItem(Long id, String passCode, String userAgent, OffsetDateTime createdAt, long entryCount) {
}

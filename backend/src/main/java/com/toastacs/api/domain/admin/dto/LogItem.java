package com.toastacs.api.domain.admin.dto;

import java.time.OffsetDateTime;

public record LogItem(Long id, String passCode, String direction, String result, String denyCode,
                      OffsetDateTime createdAt) {
}

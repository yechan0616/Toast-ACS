package com.toastacs.api.domain.entry.dto;

import java.time.OffsetDateTime;

public record EntryResponse(String result, OffsetDateTime openedAt) {
}

package com.toastacs.api.domain.entry.dto;

import com.toastacs.api.domain.entry.Direction;
import jakarta.validation.constraints.NotNull;

public record EntryRequest(@NotNull Direction direction) {
}

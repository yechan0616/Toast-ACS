package com.toastacs.api.domain.gate.dto;

import java.time.OffsetDateTime;

public record GateStatus(boolean online, OffsetDateTime lastSeenAt) {
}

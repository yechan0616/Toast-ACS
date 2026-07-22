package com.toastacs.api.domain.gate.dto;

public record GatePollRequest(boolean ultrasonicIn, boolean ultrasonicOut, int passedCount) {
}

package com.toastacs.api.domain.gate.dto;

public record GatePollRequest(boolean ultrasonic, int passedCount) {
}

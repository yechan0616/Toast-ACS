package com.toastacs.api.domain.gate.dto;

public record GatePollResponse(boolean openIn, boolean openOut, boolean alarm, String seat, String seats,
                               String denyIn, String denyOut) {
}

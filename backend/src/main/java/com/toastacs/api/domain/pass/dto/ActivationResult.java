package com.toastacs.api.domain.pass.dto;

public record ActivationResult(String cookieValue, String deviceCookieValue, ActivateResponse response) {
}

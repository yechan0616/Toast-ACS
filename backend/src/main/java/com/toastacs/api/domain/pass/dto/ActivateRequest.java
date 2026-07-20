package com.toastacs.api.domain.pass.dto;

import jakarta.validation.constraints.NotBlank;

public record ActivateRequest(@NotBlank String code) {
}

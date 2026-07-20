package com.toastacs.api.domain.pass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PassRevokeRequest(@NotBlank @Size(max = 500) String reason) {
}

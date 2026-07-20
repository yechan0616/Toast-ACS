package com.toastacs.api.domain.pass.dto;

import jakarta.validation.constraints.Size;

public record PassRequestRejectRequest(@Size(max = 500) String reason) {
}

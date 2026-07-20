package com.toastacs.api.domain.pass.dto;

import com.toastacs.api.domain.pass.PassType;
import jakarta.validation.constraints.NotNull;

public record PassRequestApproveRequest(@NotNull PassType passType) {
}

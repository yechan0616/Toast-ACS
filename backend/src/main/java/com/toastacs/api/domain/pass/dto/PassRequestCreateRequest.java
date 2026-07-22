package com.toastacs.api.domain.pass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PassRequestCreateRequest(@NotBlank @Size(max = 50) String applicantName,
                                       @NotBlank @Size(max = 20) String phone,
                                       @NotBlank @Size(max = 10) String seat,
                                       @Size(max = 500) String reason) {
}

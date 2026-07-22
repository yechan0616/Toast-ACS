package com.toastacs.api.domain.pass.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PassRequestStatusResponse(String status, String code, String passType, OffsetDateTime expiresAt,
                                        String seat, String rejectReason) {

    public static PassRequestStatusResponse pending(String status) {
        return new PassRequestStatusResponse(status, null, null, null, null, null);
    }

    public static PassRequestStatusResponse rejected(String status, String rejectReason) {
        return new PassRequestStatusResponse(status, null, null, null, null, rejectReason);
    }
}

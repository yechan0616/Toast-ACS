package com.toastacs.api.domain.session.dto;

import com.toastacs.api.domain.session.DeviceSession;

public record VerifiedSession(DeviceSession session, long window) {
}

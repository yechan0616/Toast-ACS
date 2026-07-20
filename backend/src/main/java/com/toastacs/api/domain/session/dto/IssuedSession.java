package com.toastacs.api.domain.session.dto;

import com.toastacs.api.domain.session.DeviceSession;

public record IssuedSession(DeviceSession session, String cookieValue) {
}

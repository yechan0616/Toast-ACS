package com.toastacs.api.domain.session;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class SessionCookieFactory {

    public static final String COOKIE_NAME = "acs_session";

    private final boolean secure;

    public SessionCookieFactory(@Value("${acs.cookie.secure:false}") boolean secure) {
        this.secure = secure;
    }

    public ResponseCookie create(String value) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/api")
                .build();
    }
}

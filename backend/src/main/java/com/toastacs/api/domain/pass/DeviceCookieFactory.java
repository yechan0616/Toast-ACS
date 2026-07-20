package com.toastacs.api.domain.pass;

import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class DeviceCookieFactory {

    public static final String COOKIE_NAME = "acs_device";

    private static final Duration MAX_AGE = Duration.ofDays(30);

    private final boolean secure;

    public DeviceCookieFactory(@Value("${acs.cookie.secure:false}") boolean secure) {
        this.secure = secure;
    }

    public ResponseCookie create(String value) {
        return ResponseCookie.from(COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/api")
                .maxAge(MAX_AGE)
                .build();
    }
}

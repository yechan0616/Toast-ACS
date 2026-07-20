package com.toastacs.api.domain.session;

import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TokenSigner {

    public static final long WINDOW_SECONDS = 30;
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final byte[] globalSecret;
    private final Clock clock;

    public TokenSigner(String globalSecret, Clock clock) {
        this.globalSecret = globalSecret.getBytes(StandardCharsets.UTF_8);
        this.clock = clock;
    }

    public long currentWindow() {
        return clock.instant().getEpochSecond() / WINDOW_SECONDS;
    }

    public String issue(long sessionId, String sessionSecret) {
        long window = currentWindow();
        return sessionId + "." + window + "." + sign(sessionId, window, sessionSecret);
    }

    public long extractSessionId(String token) {
        return parseLong(split(token)[0]);
    }

    public long verify(String token, String sessionSecret) {
        String[] parts = split(token);
        long sessionId = parseLong(parts[0]);
        long window = parseLong(parts[1]);
        String expected = sign(sessionId, window, sessionSecret);
        if (!MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }
        long now = currentWindow();
        if (window != now && window != now - 1) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }
        return window;
    }

    private String[] split(String token) {
        if (token == null) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }
        return parts;
    }

    private long parseLong(String value) {
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException e) {
            throw new ApiException(ErrorCode.TOKEN_EXPIRED);
        }
    }

    private String sign(long sessionId, long window, String sessionSecret) {
        byte[] derivedKey = hmac(globalSecret, sessionSecret.getBytes(StandardCharsets.UTF_8));
        byte[] mac = hmac(derivedKey, (sessionId + "." + window).getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(mac);
    }

    private byte[] hmac(byte[] key, byte[] message) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(key, HMAC_ALGORITHM));
            return mac.doFinal(message);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException(e);
        }
    }
}

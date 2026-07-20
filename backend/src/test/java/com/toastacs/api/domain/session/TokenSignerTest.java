package com.toastacs.api.domain.session;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class TokenSignerTest {

    private static final String GLOBAL_SECRET = "test-global-secret";
    private static final String SESSION_SECRET = "0123456789abcdef";
    private static final long SESSION_ID = 42L;
    private static final long BASE_EPOCH = 3_000_000L;

    private TokenSigner signerAt(long epochSeconds) {
        return new TokenSigner(GLOBAL_SECRET, Clock.fixed(Instant.ofEpochSecond(epochSeconds), ZoneOffset.UTC));
    }

    @Test
    @DisplayName("발급한 토큰은 같은 시간창에서 서명 검증을 통과한다")
    void verifyValidToken() {
        TokenSigner signer = signerAt(BASE_EPOCH);
        String token = signer.issue(SESSION_ID, SESSION_SECRET);

        long window = signer.verify(token, SESSION_SECRET);

        assertThat(window).isEqualTo(BASE_EPOCH / TokenSigner.WINDOW_SECONDS);
        assertThat(signer.extractSessionId(token)).isEqualTo(SESSION_ID);
    }

    @Test
    @DisplayName("서명이 변조된 토큰은 TOKEN_EXPIRED로 거부된다")
    void rejectTamperedSignature() {
        TokenSigner signer = signerAt(BASE_EPOCH);
        String token = signer.issue(SESSION_ID, SESSION_SECRET);
        String tampered = token.substring(0, token.length() - 2) + "xx";

        assertThatThrownBy(() -> signer.verify(tampered, SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("다른 세션 시크릿으로 서명된 토큰은 TOKEN_EXPIRED로 거부된다")
    void rejectWrongSessionSecret() {
        TokenSigner signer = signerAt(BASE_EPOCH);
        String token = signer.issue(SESSION_ID, "another-secret");

        assertThatThrownBy(() -> signer.verify(token, SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("직전 시간창의 토큰은 허용된다")
    void allowPreviousWindow() {
        String token = signerAt(BASE_EPOCH).issue(SESSION_ID, SESSION_SECRET);
        TokenSigner later = signerAt(BASE_EPOCH + TokenSigner.WINDOW_SECONDS);

        long window = later.verify(token, SESSION_SECRET);

        assertThat(window).isEqualTo(BASE_EPOCH / TokenSigner.WINDOW_SECONDS);
    }

    @Test
    @DisplayName("두 시간창 이상 지난 토큰은 TOKEN_EXPIRED로 거부된다")
    void rejectExpiredWindow() {
        String token = signerAt(BASE_EPOCH).issue(SESSION_ID, SESSION_SECRET);
        TokenSigner later = signerAt(BASE_EPOCH + TokenSigner.WINDOW_SECONDS * 2);

        assertThatThrownBy(() -> later.verify(token, SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("미래 시간창으로 조작된 토큰은 TOKEN_EXPIRED로 거부된다")
    void rejectFutureWindow() {
        String token = signerAt(BASE_EPOCH + TokenSigner.WINDOW_SECONDS).issue(SESSION_ID, SESSION_SECRET);
        TokenSigner now = signerAt(BASE_EPOCH);

        assertThatThrownBy(() -> now.verify(token, SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("형식이 잘못된 토큰은 TOKEN_EXPIRED로 거부된다")
    void rejectMalformedToken() {
        TokenSigner signer = signerAt(BASE_EPOCH);

        assertThatThrownBy(() -> signer.verify("garbage", SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
        assertThatThrownBy(() -> signer.verify(null, SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
        assertThatThrownBy(() -> signer.verify("a.b.c", SESSION_SECRET))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }
}

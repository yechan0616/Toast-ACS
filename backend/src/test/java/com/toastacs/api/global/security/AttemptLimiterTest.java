package com.toastacs.api.global.security;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class AttemptLimiterTest {

    private static final String KEY = "login:1.2.3.4";
    private static final Instant BASE = Instant.parse("2026-07-20T00:00:00Z");

    @Test
    @DisplayName("5회 실패하면 이후 시도를 TOO_MANY_ATTEMPTS로 잠근다")
    void locksAfterFiveFailures() {
        AttemptLimiter limiter = new AttemptLimiter(Clock.fixed(BASE, ZoneOffset.UTC));

        for (int i = 0; i < 5; i++) {
            limiter.check(KEY);
            limiter.recordFailure(KEY);
        }

        assertThatThrownBy(() -> limiter.check(KEY))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.TOO_MANY_ATTEMPTS);
    }

    @Test
    @DisplayName("4회까지는 잠기지 않는다")
    void allowsUpToFourFailures() {
        AttemptLimiter limiter = new AttemptLimiter(Clock.fixed(BASE, ZoneOffset.UTC));

        for (int i = 0; i < 4; i++) {
            limiter.recordFailure(KEY);
        }

        assertThatCode(() -> limiter.check(KEY)).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("잠금 시간이 지나면 다시 시도할 수 있다")
    void unlocksAfterLockDuration() {
        MutableClock clock = new MutableClock(BASE);
        AttemptLimiter limiter = new AttemptLimiter(clock);

        for (int i = 0; i < 5; i++) {
            limiter.recordFailure(KEY);
        }
        clock.advance(Duration.ofMinutes(1).plusSeconds(1));

        assertThatCode(() -> limiter.check(KEY)).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("성공하면 실패 카운터가 초기화된다")
    void successResetsCounter() {
        AttemptLimiter limiter = new AttemptLimiter(Clock.fixed(BASE, ZoneOffset.UTC));

        for (int i = 0; i < 4; i++) {
            limiter.recordFailure(KEY);
        }
        limiter.recordSuccess(KEY);
        for (int i = 0; i < 4; i++) {
            limiter.recordFailure(KEY);
        }

        assertThatCode(() -> limiter.check(KEY)).doesNotThrowAnyException();
    }

    private static final class MutableClock extends Clock {
        private Instant now;

        private MutableClock(Instant now) {
            this.now = now;
        }

        private void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneOffset getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(java.time.ZoneId zone) {
            return this;
        }
    }
}

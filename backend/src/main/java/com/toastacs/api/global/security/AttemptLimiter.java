package com.toastacs.api.global.security;

import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class AttemptLimiter {

    private static final int MAX_FAILURES = 5;
    private static final Duration LOCK_DURATION = Duration.ofMinutes(1);

    private final Clock clock;
    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public AttemptLimiter() {
        this(Clock.systemUTC());
    }

    AttemptLimiter(Clock clock) {
        this.clock = clock;
    }

    public void check(String key) {
        Attempt attempt = attempts.get(key);
        if (attempt == null) {
            return;
        }
        synchronized (attempt) {
            if (attempt.lockedUntil != null && clock.instant().isBefore(attempt.lockedUntil)) {
                throw new ApiException(ErrorCode.TOO_MANY_ATTEMPTS);
            }
        }
    }

    public void recordFailure(String key) {
        Attempt attempt = attempts.computeIfAbsent(key, k -> new Attempt());
        synchronized (attempt) {
            Instant now = clock.instant();
            if (attempt.lockedUntil != null && !now.isBefore(attempt.lockedUntil)) {
                attempt.failures = 0;
                attempt.lockedUntil = null;
            }
            attempt.failures++;
            if (attempt.failures >= MAX_FAILURES) {
                attempt.lockedUntil = now.plus(LOCK_DURATION);
            }
        }
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    private static final class Attempt {
        private int failures;
        private Instant lockedUntil;
    }
}

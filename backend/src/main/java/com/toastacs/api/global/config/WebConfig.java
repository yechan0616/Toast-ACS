package com.toastacs.api.global.config;

import com.toastacs.api.domain.session.TokenSigner;
import java.time.Clock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public Clock clock() {
        return Clock.systemUTC();
    }

    @Bean
    public TokenSigner tokenSigner(@Value("${acs.hmac-secret}") String hmacSecret, Clock clock) {
        return new TokenSigner(hmacSecret, clock);
    }
}

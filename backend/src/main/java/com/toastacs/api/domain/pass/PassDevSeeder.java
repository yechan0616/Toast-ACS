package com.toastacs.api.domain.pass;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("local")
@RequiredArgsConstructor
public class PassDevSeeder implements ApplicationRunner {

    private final PassRepository passRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (passRepository.count() > 0) {
            return;
        }
        passRepository.save(Pass.create("DEMO-1234", PassType.PERIOD, Instant.now().plus(30, ChronoUnit.DAYS)));
        passRepository.save(Pass.create("TIME-5678", PassType.TIME, Instant.now().plus(2, ChronoUnit.HOURS)));
    }
}

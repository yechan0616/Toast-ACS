package com.toastacs.api.domain.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminAccountSeeder implements ApplicationRunner {

    private final AdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final String username;
    private final String password;

    public AdminAccountSeeder(AdminAccountRepository adminAccountRepository,
                              PasswordEncoder passwordEncoder,
                              @Value("${acs.admin.username}") String username,
                              @Value("${acs.admin.password}") String password) {
        this.adminAccountRepository = adminAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.username = username;
        this.password = password;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (adminAccountRepository.count() > 0) {
            return;
        }
        adminAccountRepository.save(AdminAccount.create(username, passwordEncoder.encode(password)));
    }
}

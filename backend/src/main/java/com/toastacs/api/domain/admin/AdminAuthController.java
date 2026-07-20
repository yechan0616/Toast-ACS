package com.toastacs.api.domain.admin;

import com.toastacs.api.domain.admin.dto.AdminLoginRequest;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.security.AttemptLimiter;
import com.toastacs.api.global.web.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;
    private final AttemptLimiter attemptLimiter;

    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody AdminLoginRequest loginRequest,
                                      HttpServletRequest request, HttpServletResponse response) {
        String key = "login:" + ClientIp.of(request);
        attemptLimiter.check(key);
        try {
            adminAuthService.login(loginRequest.username(), loginRequest.password(), request, response);
        } catch (ApiException e) {
            attemptLimiter.recordFailure(key);
            throw e;
        }
        attemptLimiter.recordSuccess(key);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        adminAuthService.logout(request);
        return ResponseEntity.noContent().build();
    }
}

package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.pass.dto.ActivateRequest;
import com.toastacs.api.domain.pass.dto.ActivateResponse;
import com.toastacs.api.domain.pass.dto.ActivationResult;
import com.toastacs.api.domain.pass.dto.MeResponse;
import com.toastacs.api.domain.pass.dto.MeResult;
import com.toastacs.api.domain.session.SessionCookieFactory;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.security.AttemptLimiter;
import com.toastacs.api.global.web.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PassController {

    private final PassService passService;
    private final SessionCookieFactory sessionCookieFactory;
    private final AttemptLimiter attemptLimiter;

    @PostMapping("/passes/activate")
    public ResponseEntity<ActivateResponse> activate(@Valid @RequestBody ActivateRequest request,
                                                     @RequestHeader(value = HttpHeaders.USER_AGENT, required = false) String userAgent,
                                                     @CookieValue(value = DeviceCookieFactory.COOKIE_NAME, required = false) String deviceToken,
                                                     HttpServletRequest servletRequest) {
        String key = "activate:" + ClientIp.of(servletRequest);
        attemptLimiter.check(key);
        ActivationResult result;
        try {
            result = passService.activate(request.code(), userAgent, deviceToken);
        } catch (ApiException e) {
            attemptLimiter.recordFailure(key);
            throw e;
        }
        attemptLimiter.recordSuccess(key);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookieFactory.create(result.cookieValue()).toString())
                .body(result.response());
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(
            @CookieValue(value = SessionCookieFactory.COOKIE_NAME, required = false) String token) {
        MeResult result = passService.me(token);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookieFactory.create(result.cookieValue()).toString())
                .body(result.response());
    }
}

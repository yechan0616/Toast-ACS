package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.pass.dto.PassRequestCreateRequest;
import com.toastacs.api.domain.pass.dto.PassRequestCreateResponse;
import com.toastacs.api.domain.pass.dto.PassRequestCreateResult;
import com.toastacs.api.domain.pass.dto.PassRequestStatusResponse;
import com.toastacs.api.global.web.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/passes")
@RequiredArgsConstructor
public class PassRequestController {

    private final PassRequestService passRequestService;
    private final DeviceCookieFactory deviceCookieFactory;

    @PostMapping("/request")
    public ResponseEntity<PassRequestCreateResponse> request(@Valid @RequestBody PassRequestCreateRequest request,
            HttpServletRequest servletRequest) {
        PassRequestCreateResult result = passRequestService.request(request, ClientIp.of(servletRequest));
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deviceCookieFactory.create(result.cookieValue()).toString())
                .body(result.response());
    }

    @GetMapping("/requests/{requestId}")
    public PassRequestStatusResponse status(@PathVariable UUID requestId) {
        return passRequestService.status(requestId);
    }
}

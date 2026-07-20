package com.toastacs.api.domain.entry;

import com.toastacs.api.domain.entry.dto.EntryOutcome;
import com.toastacs.api.domain.entry.dto.EntryRequest;
import com.toastacs.api.domain.entry.dto.EntryResponse;
import com.toastacs.api.domain.session.SessionCookieFactory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entries")
@RequiredArgsConstructor
public class EntryController {

    private final EntryService entryService;
    private final SessionCookieFactory sessionCookieFactory;

    @PostMapping
    public ResponseEntity<EntryResponse> attempt(
            @CookieValue(value = SessionCookieFactory.COOKIE_NAME, required = false) String token,
            @Valid @RequestBody EntryRequest request) {
        EntryOutcome outcome = entryService.attempt(token, request.direction());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, sessionCookieFactory.create(outcome.cookieValue()).toString())
                .body(outcome.response());
    }
}

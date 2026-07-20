package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.pass.dto.PassRevokeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/passes")
@RequiredArgsConstructor
public class PassAdminController {

    private final PassService passService;

    @PostMapping("/{code}/revoke")
    public ResponseEntity<Void> revoke(@PathVariable String code, @Valid @RequestBody PassRevokeRequest request) {
        passService.revoke(code, request.reason());
        return ResponseEntity.noContent().build();
    }
}

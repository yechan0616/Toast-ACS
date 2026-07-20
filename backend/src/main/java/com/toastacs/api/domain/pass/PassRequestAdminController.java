package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.admin.dto.PageResponse;
import com.toastacs.api.domain.pass.dto.PassRequestApproveRequest;
import com.toastacs.api.domain.pass.dto.PassRequestApproveResponse;
import com.toastacs.api.domain.pass.dto.PassRequestItem;
import com.toastacs.api.domain.pass.dto.PassRequestRejectRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/pass-requests")
@RequiredArgsConstructor
public class PassRequestAdminController {

    private final PassRequestService passRequestService;

    @GetMapping
    public PageResponse<PassRequestItem> list(@RequestParam(defaultValue = "PENDING") PassRequestStatus status,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        return passRequestService.list(status, page, size);
    }

    @PostMapping("/{requestId}/approve")
    public PassRequestApproveResponse approve(@PathVariable UUID requestId,
            @Valid @RequestBody PassRequestApproveRequest body) {
        return passRequestService.approve(requestId, body.passType());
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> reject(@PathVariable UUID requestId,
            @Valid @RequestBody(required = false) PassRequestRejectRequest body) {
        passRequestService.reject(requestId, body == null ? null : body.reason());
        return ResponseEntity.noContent().build();
    }
}

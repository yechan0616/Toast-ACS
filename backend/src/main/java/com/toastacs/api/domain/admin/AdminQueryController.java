package com.toastacs.api.domain.admin;

import com.toastacs.api.domain.admin.dto.AlertItem;
import com.toastacs.api.domain.admin.dto.GateOpenRequest;
import com.toastacs.api.domain.admin.dto.LogItem;
import com.toastacs.api.domain.admin.dto.LogType;
import com.toastacs.api.domain.admin.dto.OverviewResponse;
import com.toastacs.api.domain.admin.dto.PageResponse;
import com.toastacs.api.domain.admin.dto.SessionItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminQueryController {

    private final AdminQueryService adminQueryService;

    @GetMapping("/overview")
    public OverviewResponse overview() {
        return adminQueryService.overview();
    }

    @GetMapping("/logs")
    public PageResponse<LogItem> logs(@RequestParam(defaultValue = "ENTRY") LogType type,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size) {
        return adminQueryService.logs(type, page, size);
    }

    @GetMapping("/alerts")
    public PageResponse<AlertItem> alerts(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size) {
        return adminQueryService.alerts(page, size);
    }

    @GetMapping("/sessions")
    public PageResponse<SessionItem> sessions(@RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "20") int size) {
        return adminQueryService.sessions(page, size);
    }

    @PostMapping("/gate/open")
    public ResponseEntity<Void> openGate(@RequestBody(required = false) GateOpenRequest request) {
        adminQueryService.openGate();
        log.info("관리자 원격 개방 요청 reason={}", request == null ? null : request.reason());
        return ResponseEntity.ok().build();
    }
}

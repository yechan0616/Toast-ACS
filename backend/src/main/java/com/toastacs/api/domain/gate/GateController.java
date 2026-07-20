package com.toastacs.api.domain.gate;

import com.toastacs.api.domain.gate.dto.GatePollRequest;
import com.toastacs.api.domain.gate.dto.GatePollResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gate")
@RequiredArgsConstructor
public class GateController {

    private final GateStateService gateStateService;

    @PostMapping("/poll")
    public GatePollResponse poll(@RequestBody GatePollRequest request) {
        return gateStateService.poll(request);
    }
}

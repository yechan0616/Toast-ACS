package com.toastacs.api.domain.admin.dto;

import com.toastacs.api.domain.gate.dto.GateStatus;
import java.util.List;

public record OverviewResponse(
        long insideCount,
        long activeSessionCount,
        long pendingRequests,
        long totalEntries,
        GateStatus gate,
        TodayStats today,
        List<Long> trend14,
        List<SuspectedPass> suspectedPasses) {

    public record TodayStats(long entries, long denied, long sessionKills, long alerts) {
    }

    public record SuspectedPass(String code, long kills) {
    }
}

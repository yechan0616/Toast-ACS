package com.toastacs.api.domain.gate;

import com.toastacs.api.global.error.ErrorCode;
import java.util.Map;
import java.util.Set;

public final class GateDenyLabels {

    private static final Map<ErrorCode, String> LABELS = Map.ofEntries(
            Map.entry(ErrorCode.SESSION_REQUIRED, "미등록 기기"),
            Map.entry(ErrorCode.TOKEN_EXPIRED, "만료 토큰"),
            Map.entry(ErrorCode.TOKEN_REUSED, "토큰 재사용"),
            Map.entry(ErrorCode.SESSION_KILLED, "무효 세션"),
            Map.entry(ErrorCode.ALREADY_INSIDE, "중복 입장"),
            Map.entry(ErrorCode.NOT_INSIDE, "입장 기록 없음"),
            Map.entry(ErrorCode.NO_PRESENCE, "현장 확인 실패"),
            Map.entry(ErrorCode.PASS_NOT_FOUND, "위조 티켓"),
            Map.entry(ErrorCode.PASS_REVOKED, "취소된 티켓"),
            Map.entry(ErrorCode.PASS_EXPIRED, "만료된 티켓"),
            Map.entry(ErrorCode.DEVICE_MISMATCH, "기기 불일치"));

    private static final Set<ErrorCode> DIRECTIONAL =
            Set.of(ErrorCode.ALREADY_INSIDE, ErrorCode.NOT_INSIDE, ErrorCode.NO_PRESENCE);

    private GateDenyLabels() {
    }

    public static String labelFor(ErrorCode code) {
        return LABELS.get(code);
    }

    public static boolean isDirectional(ErrorCode code) {
        return DIRECTIONAL.contains(code);
    }
}

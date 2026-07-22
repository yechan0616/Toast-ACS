package com.toastacs.api.global.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    PASS_NOT_FOUND(HttpStatus.NOT_FOUND, "인증코드가 일치하지 않아요. 다시 확인해 주세요."),
    PASS_EXPIRED(HttpStatus.GONE, "이용 기간이 끝났어요. 서비스를 다시 요청하면 이용할 수 있어요."),
    PASS_REVOKED(HttpStatus.FORBIDDEN, "관리자가 이용을 취소했어요."),
    SESSION_REQUIRED(HttpStatus.UNAUTHORIZED, "기기 등록이 필요해요. 인증코드를 입력해 주세요."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "인증이 만료됐어요. 다시 시도해 주세요."),
    TOKEN_REUSED(HttpStatus.UNAUTHORIZED, "조금 전 요청과 겹쳤어요. 잠시 후 다시 시도해 주세요."),
    SESSION_KILLED(HttpStatus.UNAUTHORIZED, "다른 기기에서 등록해서 이 기기의 연결이 끊겼어요."),
    NO_PRESENCE(HttpStatus.FORBIDDEN, "게이트 앞으로 이동하면 입장할 수 있어요."),
    ALREADY_INSIDE(HttpStatus.CONFLICT, "이미 입장해 있어요. 퇴장한 다음 다시 이용해 주세요."),
    NOT_INSIDE(HttpStatus.CONFLICT, "입장 기록이 없어요. 먼저 입장해 주세요."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호를 다시 확인해 주세요."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "관리자 로그인이 필요해요."),
    GATE_KEY_INVALID(HttpStatus.UNAUTHORIZED, "게이트 키를 다시 확인해 주세요."),
    DEVICE_MISMATCH(HttpStatus.FORBIDDEN, "요청한 기기에서만 등록할 수 있는 코드예요."),
    REQUEST_NOT_FOUND(HttpStatus.NOT_FOUND, "요청 내역을 찾을 수 없어요."),
    SEAT_INVALID(HttpStatus.BAD_REQUEST, "좌석을 다시 선택해 주세요."),
    SEAT_TAKEN(HttpStatus.CONFLICT, "이미 예약된 좌석이에요. 다른 좌석을 선택해 주세요."),
    ALREADY_DECIDED(HttpStatus.CONFLICT, "이미 처리된 요청이에요."),
    TOO_MANY_ATTEMPTS(HttpStatus.TOO_MANY_REQUESTS, "시도가 너무 많아요. 잠시 후 다시 시도해 주세요.");

    private final HttpStatus status;
    private final String message;
}

package com.toastacs.api.domain.pass;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.toastacs.api.domain.pass.dto.PassRequestApproveResponse;
import com.toastacs.api.domain.pass.dto.PassRequestCreateRequest;
import com.toastacs.api.domain.pass.dto.PassRequestCreateResult;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PassRequestServiceTest {

    private static final String CODE_PATTERN = "[A-HJ-NP-Z2-9]{4}-[A-HJ-NP-Z2-9]{4}";
    private static final String SEAT = "A3";

    @Mock
    private PassRequestRepository passRequestRepository;

    @Mock
    private PassRepository passRepository;

    @Mock
    private SeatService seatService;

    @InjectMocks
    private PassRequestService passRequestService;

    private final UUID requestId = UUID.randomUUID();

    @Test
    @DisplayName("신청 생성 시 좌석을 검증해 저장하고 기기 토큰을 쿠키 값으로 돌려준다")
    void requestGeneratesDeviceToken() {
        given(passRequestRepository.save(any(PassRequest.class)))
                .willAnswer(invocation -> invocation.getArgument(0));

        PassRequestCreateResult result = passRequestService.request(
                new PassRequestCreateRequest("문예찬", "010-1234-5678", SEAT, null), "127.0.0.1");

        verify(seatService).validateSelectable(SEAT);
        ArgumentCaptor<PassRequest> captor = ArgumentCaptor.forClass(PassRequest.class);
        verify(passRequestRepository).save(captor.capture());
        PassRequest saved = captor.getValue();
        assertThat(saved.getSeat()).isEqualTo(SEAT);
        assertThat(saved.getDeviceToken()).isNotBlank();
        assertThat(result.cookieValue()).isEqualTo(saved.getDeviceToken());
        assertThat(result.response().requestId()).isEqualTo(saved.getPublicId());
    }

    @Test
    @DisplayName("이미 예약된 좌석으로 신청하면 SEAT_TAKEN으로 거부하고 저장하지 않는다")
    void requestWithTakenSeat() {
        willThrow(new ApiException(ErrorCode.SEAT_TAKEN)).given(seatService).validateSelectable(SEAT);

        assertThatThrownBy(() -> passRequestService.request(
                new PassRequestCreateRequest("문예찬", "010-1234-5678", SEAT, null), "127.0.0.1"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.SEAT_TAKEN);
        verify(passRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("신청마다 서로 다른 기기 토큰을 생성한다")
    void requestGeneratesDistinctDeviceTokens() {
        PassRequest first = PassRequest.create("문예찬", "010-1234-5678", "127.0.0.1", null, SEAT);
        PassRequest second = PassRequest.create("문예찬", "010-1234-5678", "127.0.0.1", null, SEAT);

        assertThat(first.getDeviceToken()).isNotEqualTo(second.getDeviceToken());
    }

    @Test
    @DisplayName("승인 시 신청의 기기 토큰을 발급 이용권에 복사한다")
    void approveCopiesDeviceTokenToPass() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);

        passRequestService.approve(requestId, PassType.TIME);

        ArgumentCaptor<Pass> captor = ArgumentCaptor.forClass(Pass.class);
        verify(passRepository).save(captor.capture());
        assertThat(captor.getValue().getDeviceToken()).isEqualTo(request.getDeviceToken());
    }

    @Test
    @DisplayName("승인 시 신청 때 고른 좌석을 이용권에 배정한다")
    void approveAssignsRequestedSeat() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);

        passRequestService.approve(requestId, PassType.TIME);

        ArgumentCaptor<Pass> captor = ArgumentCaptor.forClass(Pass.class);
        verify(passRepository).save(captor.capture());
        assertThat(captor.getValue().getSeat()).isEqualTo(SEAT);
    }

    @Test
    @DisplayName("승인 시점에 좌석이 이미 사용 중이면 SEAT_TAKEN으로 실패한다")
    void approveWithConflictingSeat() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willThrow(new ApiException(ErrorCode.SEAT_TAKEN));

        assertThatThrownBy(() -> passRequestService.approve(requestId, PassType.TIME))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.SEAT_TAKEN);
        verify(passRepository, never()).save(any());
        assertThat(request.getStatus()).isEqualTo(PassRequestStatus.PENDING);
    }

    @Test
    @DisplayName("승인 시 혼동 문자 없는 XXXX-XXXX 코드로 이용권을 발급하고 신청을 APPROVED로 전이한다")
    void approveIssuesFormattedCode() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);

        PassRequestApproveResponse response = passRequestService.approve(requestId, PassType.TIME);

        assertThat(response.code()).matches(CODE_PATTERN);
        assertThat(response.expiresAt().getOffset()).isEqualTo(ZoneOffset.ofHours(9));
        ArgumentCaptor<Pass> captor = ArgumentCaptor.forClass(Pass.class);
        verify(passRepository).save(captor.capture());
        Pass pass = captor.getValue();
        assertThat(pass.getSeat()).isEqualTo(SEAT);
        assertThat(pass.getCode()).isEqualTo(response.code());
        assertThat(pass.getType()).isEqualTo(PassType.TIME);
        assertThat(request.getPassType()).isEqualTo(PassType.TIME);
        assertThat(request.getStatus()).isEqualTo(PassRequestStatus.APPROVED);
        assertThat(request.getPass()).isSameAs(pass);
        assertThat(request.getDecidedAt()).isNotNull();
    }

    @Test
    @DisplayName("TIME 승인은 만료를 24시간 뒤로 계산한다")
    void approveTimeExpiresInTwentyFourHours() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);
        Instant before = Instant.now();

        passRequestService.approve(requestId, PassType.TIME);

        Instant after = Instant.now();
        ArgumentCaptor<Pass> captor = ArgumentCaptor.forClass(Pass.class);
        verify(passRepository).save(captor.capture());
        assertThat(captor.getValue().getExpiresAt())
                .isBetween(before.plus(24, ChronoUnit.HOURS), after.plus(24, ChronoUnit.HOURS));
    }

    @Test
    @DisplayName("PERIOD 승인은 만료를 30일 뒤로 계산한다")
    void approvePeriodExpiresInThirtyDays() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);
        Instant before = Instant.now();

        passRequestService.approve(requestId, PassType.PERIOD);

        Instant after = Instant.now();
        ArgumentCaptor<Pass> captor = ArgumentCaptor.forClass(Pass.class);
        verify(passRepository).save(captor.capture());
        assertThat(captor.getValue().getExpiresAt())
                .isBetween(before.plus(30, ChronoUnit.DAYS), after.plus(30, ChronoUnit.DAYS));
    }

    @Test
    @DisplayName("코드가 이미 존재하면 유니크할 때까지 재생성한다")
    void approveRegeneratesCodeOnCollision() {
        PassRequest request = pendingRequest();
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(true, true, false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);

        PassRequestApproveResponse response = passRequestService.approve(requestId, PassType.TIME);

        assertThat(response.code()).matches(CODE_PATTERN);
        verify(passRepository, times(3)).existsByCode(anyString());
    }

    @Test
    @DisplayName("이미 승인된 신청을 다시 승인하면 ALREADY_DECIDED로 실패하고 이용권을 만들지 않는다")
    void approveAlreadyDecided() {
        PassRequest request = pendingRequest();
        request.approve(Pass.create("AB3D-9FKQ", PassType.TIME, Instant.now().plus(24, ChronoUnit.HOURS)));
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));
        given(passRepository.existsByCode(anyString())).willReturn(false);
        given(seatService.resolveForApproval(SEAT)).willReturn(SEAT);

        assertThatThrownBy(() -> passRequestService.approve(requestId, PassType.TIME))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.ALREADY_DECIDED);
        verify(passRepository, never()).save(any());
    }

    @Test
    @DisplayName("이미 거절된 신청을 다시 거절하면 ALREADY_DECIDED로 실패한다")
    void rejectAlreadyDecided() {
        PassRequest request = pendingRequest();
        request.reject(null);
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.of(request));

        assertThatThrownBy(() -> passRequestService.reject(requestId, null))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.ALREADY_DECIDED);
    }

    @Test
    @DisplayName("존재하지 않는 신청 승인은 REQUEST_NOT_FOUND로 실패한다")
    void approveUnknownRequest() {
        given(passRequestRepository.findByPublicId(requestId)).willReturn(Optional.empty());

        assertThatThrownBy(() -> passRequestService.approve(requestId, PassType.TIME))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.REQUEST_NOT_FOUND);
        verify(passRepository, never()).save(any());
    }

    private PassRequest pendingRequest() {
        return PassRequest.create("문예찬", "010-1234-5678", "127.0.0.1", null, SEAT);
    }
}

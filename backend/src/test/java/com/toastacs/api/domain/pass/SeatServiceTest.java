package com.toastacs.api.domain.pass;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SeatServiceTest {

    @Mock
    private PassRepository passRepository;

    @Mock
    private PassRequestRepository passRequestRepository;

    @InjectMocks
    private SeatService seatService;

    @Test
    @DisplayName("좌석은 A1~A8, B1~B8 총 16개다")
    void seatGridIsSixteen() {
        assertThat(Seats.ALL).hasSize(16);
        assertThat(Seats.ALL.get(0)).isEqualTo("A1");
        assertThat(Seats.ALL.get(7)).isEqualTo("A8");
        assertThat(Seats.ALL.get(8)).isEqualTo("B1");
        assertThat(Seats.ALL.get(15)).isEqualTo("B8");
    }

    @Test
    @DisplayName("활성 이용권 좌석과 대기 중 신청 좌석을 모두 예약으로 본다")
    void takenSeatsMergesPassAndPendingRequest() {
        given(passRepository.findActiveSeats(any())).willReturn(List.of("A3"));
        given(passRequestRepository.findSeatsByStatus(PassRequestStatus.PENDING)).willReturn(List.of("B7"));

        assertThat(seatService.takenSeats()).containsExactlyInAnyOrder("A3", "B7");
    }

    @Test
    @DisplayName("점유 마스크는 좌석 순서대로 예약 여부를 1과 0으로 나타낸다")
    void occupancyMaskFollowsSeatOrder() {
        given(passRepository.findActiveSeats(any())).willReturn(List.of("A1"));
        given(passRequestRepository.findSeatsByStatus(PassRequestStatus.PENDING)).willReturn(List.of("B8"));

        assertThat(seatService.occupancyMask()).isEqualTo("1000000000000001");
    }

    @Test
    @DisplayName("없는 좌석은 SEAT_INVALID, 예약된 좌석은 SEAT_TAKEN으로 거부한다")
    void validateSelectableRejectsInvalidAndTaken() {
        assertThatThrownBy(() -> seatService.validateSelectable("Z9"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.SEAT_INVALID);

        given(passRepository.findActiveSeats(any())).willReturn(List.of("A3"));
        given(passRequestRepository.findSeatsByStatus(PassRequestStatus.PENDING)).willReturn(List.of());
        assertThatThrownBy(() -> seatService.validateSelectable("A3"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.SEAT_TAKEN);
    }

    @Test
    @DisplayName("승인 시 신청 좌석이 활성 이용권과 겹치면 SEAT_TAKEN, 아니면 그대로 반환한다")
    void resolveForApprovalChecksActivePasses() {
        given(passRepository.findActiveSeats(any())).willReturn(List.of("A3"));

        assertThatThrownBy(() -> seatService.resolveForApproval("A3"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.SEAT_TAKEN);
        assertThat(seatService.resolveForApproval("B1")).isEqualTo("B1");
    }
}

package com.toastacs.api.domain.gate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verifyNoInteractions;

import com.toastacs.api.domain.alert.AlertService;
import com.toastacs.api.domain.entry.Direction;
import com.toastacs.api.domain.pass.SeatService;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Clock;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GateStateServiceTest {

    @Mock
    private GateStateRepository gateStateRepository;

    @Mock
    private AlertService alertService;

    @Mock
    private SeatService seatService;

    private GateStateService gateStateService;
    private GateState state;

    @BeforeEach
    void setUp() {
        gateStateService = new GateStateService(gateStateRepository, alertService, seatService,
                Clock.systemUTC());
        state = new GateState();
    }

    @Test
    @DisplayName("방향 종속 차단(NO_PRESENCE 등)은 해당 게이트에만 표시를 큐잉한다")
    void directionalDenyQueuesSingleGate() {
        given(gateStateRepository.findById((short) 1)).willReturn(Optional.of(state));

        gateStateService.notifyDenied(ErrorCode.NO_PRESENCE, Direction.IN);

        assertThat(state.consumeDeny(Direction.IN)).isEqualTo("현장 확인 실패");
        assertThat(state.consumeDeny(Direction.OUT)).isNull();
    }

    @Test
    @DisplayName("공통 보안 차단(토큰 재사용 등)은 양쪽 게이트에 표시를 큐잉한다")
    void commonDenyQueuesBothGates() {
        given(gateStateRepository.findById((short) 1)).willReturn(Optional.of(state));

        gateStateService.notifyDenied(ErrorCode.TOKEN_REUSED, Direction.IN);

        assertThat(state.consumeDeny(Direction.IN)).isEqualTo("토큰 재사용");
        assertThat(state.consumeDeny(Direction.OUT)).isEqualTo("토큰 재사용");
    }

    @Test
    @DisplayName("활성화 계열 차단(위조 티켓)은 방향이 없어도 양쪽에 큐잉한다")
    void activationDenyQueuesBothGates() {
        given(gateStateRepository.findById((short) 1)).willReturn(Optional.of(state));

        gateStateService.notifyDenied(ErrorCode.PASS_NOT_FOUND, null);

        assertThat(state.consumeDeny(Direction.IN)).isEqualTo("위조 티켓");
        assertThat(state.consumeDeny(Direction.OUT)).isEqualTo("위조 티켓");
    }

    @Test
    @DisplayName("게이트 표시 대상이 아닌 코드는 아무것도 큐잉하지 않는다")
    void unrelatedCodeIsIgnored() {
        gateStateService.notifyDenied(ErrorCode.INVALID_CREDENTIALS, Direction.IN);

        verifyNoInteractions(gateStateRepository);
    }
}

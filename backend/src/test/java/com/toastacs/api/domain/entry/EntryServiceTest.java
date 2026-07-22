package com.toastacs.api.domain.entry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.toastacs.api.domain.entry.dto.EntryOutcome;
import com.toastacs.api.domain.gate.GateStateService;
import com.toastacs.api.domain.pass.Pass;
import com.toastacs.api.domain.pass.PassService;
import com.toastacs.api.domain.pass.PassType;
import com.toastacs.api.domain.session.DeviceSession;
import com.toastacs.api.domain.session.DeviceSessionService;
import com.toastacs.api.domain.session.dto.VerifiedSession;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class EntryServiceTest {

    private static final String TOKEN = "1.100.signature";

    @Mock
    private DeviceSessionService deviceSessionService;

    @Mock
    private PassService passService;

    @Mock
    private GateStateService gateStateService;

    @Mock
    private EntryLogRepository entryLogRepository;

    @InjectMocks
    private EntryService entryService;

    private Pass pass;
    private DeviceSession session;
    private VerifiedSession verified;

    @BeforeEach
    void setUp() {
        pass = Pass.create("DEMO-1234", PassType.PERIOD, Instant.now().plus(30, ChronoUnit.DAYS));
        ReflectionTestUtils.setField(pass, "id", 1L);
        ReflectionTestUtils.setField(pass, "seat", "A3");
        session = DeviceSession.create(pass, "session-secret", "test-agent");
        ReflectionTestUtils.setField(session, "id", 10L);
        verified = new VerifiedSession(session, 100L);
    }

    @Test
    @DisplayName("1단계 - 쿠키가 없으면 SESSION_REQUIRED로 거부하고 거부 로그를 남긴다")
    void denyWithoutCookie() {
        assertDenied(() -> entryService.attempt(null, Direction.IN), ErrorCode.SESSION_REQUIRED);
        assertDenied(() -> entryService.attempt(" ", Direction.IN), ErrorCode.SESSION_REQUIRED);
    }

    @Test
    @DisplayName("2단계 - 서명·시간창 검증 실패면 TOKEN_EXPIRED로 거부한다")
    void denyExpiredToken() {
        given(deviceSessionService.verify(TOKEN)).willThrow(new ApiException(ErrorCode.TOKEN_EXPIRED));

        assertDenied(() -> entryService.attempt(TOKEN, Direction.IN), ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    @DisplayName("모든 검사 통과 후 창 선점 경쟁에서 지면 TOKEN_REUSED로 거부한다")
    void denyReusedToken() {
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        given(gateStateService.isPresenceDetected(Direction.IN)).willReturn(true);
        willThrow(new ApiException(ErrorCode.TOKEN_REUSED)).given(deviceSessionService).claimWindow(verified);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.IN), ErrorCode.TOKEN_REUSED);
    }

    @Test
    @DisplayName("4단계 - 세션이 종료되었으면 SESSION_KILLED로 거부한다")
    void denyKilledSession() {
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        willThrow(new ApiException(ErrorCode.SESSION_KILLED)).given(deviceSessionService).ensureActive(session);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.IN), ErrorCode.SESSION_KILLED);
    }

    @Test
    @DisplayName("5단계 - 재실 상태에서 입장 요청이면 ALREADY_INSIDE로 거부한다")
    void denyEnterWhenAlreadyInside() {
        pass.enter();
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.IN), ErrorCode.ALREADY_INSIDE);
    }

    @Test
    @DisplayName("5단계 - 입장 기록 없이 퇴장 요청이면 NOT_INSIDE로 거부한다")
    void denyExitWhenNotInside() {
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.OUT), ErrorCode.NOT_INSIDE);
    }

    @Test
    @DisplayName("6단계 - 초음파 현장 확인 실패면 NO_PRESENCE로 거부하고 창을 소비하지 않는다")
    void denyWithoutPresence() {
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        given(gateStateService.isPresenceDetected(Direction.IN)).willReturn(false);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.IN), ErrorCode.NO_PRESENCE);
        verify(gateStateService, never()).queueOpen(any(), any());
        verify(deviceSessionService, never()).claimWindow(any());
    }

    @Test
    @DisplayName("입장 게이트 초음파만 감지된 상태의 퇴장 요청은 NO_PRESENCE로 거부한다")
    void denyExitAtEntryGate() {
        pass.enter();
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        given(gateStateService.isPresenceDetected(Direction.OUT)).willReturn(false);

        assertDenied(() -> entryService.attempt(TOKEN, Direction.OUT), ErrorCode.NO_PRESENCE);
        verify(gateStateService, never()).queueOpen(any(), any());
    }

    @Test
    @DisplayName("전 단계 통과 시 입장을 허용하고 창 소비·재실 반전·개방 큐·허용 로그를 수행한다")
    void allowEntry() {
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        given(gateStateService.isPresenceDetected(Direction.IN)).willReturn(true);
        given(deviceSessionService.reissueCookie(session)).willReturn("rotated-cookie");

        EntryOutcome outcome = entryService.attempt(TOKEN, Direction.IN);

        assertThat(outcome.response().result()).isEqualTo("ALLOWED");
        assertThat(outcome.response().openedAt()).isNotNull();
        assertThat(outcome.cookieValue()).isEqualTo("rotated-cookie");
        verify(deviceSessionService).claimWindow(verified);
        verify(passService).applyEntry(1L, Direction.IN);
        verify(gateStateService).queueOpen(Direction.IN, "A3");
        ArgumentCaptor<EntryLog> captor = ArgumentCaptor.forClass(EntryLog.class);
        verify(entryLogRepository).save(captor.capture());
        assertThat(captor.getValue().getResult()).isEqualTo(EntryResult.ALLOWED);
        assertThat(captor.getValue().getPassId()).isEqualTo(1L);
        assertThat(captor.getValue().getSessionId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("재실 상태에서 퇴장 요청은 허용된다")
    void allowExit() {
        pass.enter();
        given(deviceSessionService.verify(TOKEN)).willReturn(verified);
        given(gateStateService.isPresenceDetected(Direction.OUT)).willReturn(true);
        given(deviceSessionService.reissueCookie(session)).willReturn("rotated-cookie");

        EntryOutcome outcome = entryService.attempt(TOKEN, Direction.OUT);

        assertThat(outcome.response().result()).isEqualTo("ALLOWED");
        verify(passService).applyEntry(1L, Direction.OUT);
        verify(gateStateService).queueOpen(Direction.OUT, null);
    }

    private void assertDenied(Runnable call, ErrorCode expected) {
        assertThatThrownBy(call::run)
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(expected);
        ArgumentCaptor<EntryLog> captor = ArgumentCaptor.forClass(EntryLog.class);
        verify(entryLogRepository, org.mockito.Mockito.atLeastOnce()).save(captor.capture());
        EntryLog last = captor.getValue();
        assertThat(last.getResult()).isEqualTo(EntryResult.DENIED);
        assertThat(last.getDenyCode()).isEqualTo(expected.name());
        verify(gateStateService, org.mockito.Mockito.atLeastOnce())
                .notifyDenied(org.mockito.ArgumentMatchers.eq(expected), any());
        verify(passService, never()).applyEntry(any(), any());
    }
}

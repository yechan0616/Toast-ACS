package com.toastacs.api.domain.pass;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.toastacs.api.domain.pass.dto.ActivationResult;
import com.toastacs.api.domain.session.DeviceSessionService;
import com.toastacs.api.domain.session.dto.IssuedSession;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PassServiceTest {

    private static final String CODE = "AB3D-9FKQ";
    private static final String DEVICE_TOKEN = "device-token";
    private static final String USER_AGENT = "test-agent";
    private static final String REASON = "규정 위반으로 이용을 제한합니다";

    @Mock
    private PassRepository passRepository;

    @Mock
    private DeviceSessionService deviceSessionService;

    @Mock
    private com.toastacs.api.domain.entry.EntryLogRepository entryLogRepository;

    @Mock
    private com.toastacs.api.domain.gate.GateStateService gateStateService;

    private PassService passService;

    @BeforeEach
    void setUp() {
        passService = new PassService(passRepository, deviceSessionService, entryLogRepository,
                gateStateService, "테스트 서비스", "테스트 게이트");
    }

    @Test
    @DisplayName("기기 귀속 이용권은 신청 기기의 토큰이 일치하면 활성화된다")
    void activateBoundPassWithMatchingToken() {
        Pass pass = boundPass();
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));
        given(deviceSessionService.issue(pass, USER_AGENT))
                .willReturn(new IssuedSession(null, "session-cookie"));

        ActivationResult result = passService.activate(CODE, USER_AGENT, DEVICE_TOKEN);

        assertThat(result.cookieValue()).isEqualTo("session-cookie");
        assertThat(result.response().passType()).isEqualTo(PassType.PERIOD.name());
    }

    @Test
    @DisplayName("기기 귀속 이용권을 다른 토큰으로 활성화하면 DEVICE_MISMATCH로 거부한다")
    void activateBoundPassWithWrongToken() {
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(boundPass()));

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, "other-token"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEVICE_MISMATCH);
        verify(deviceSessionService, never()).issue(any(), anyString());
    }

    @Test
    @DisplayName("기기 귀속 이용권을 쿠키 없이 활성화하면 DEVICE_MISMATCH로 거부한다")
    void activateBoundPassWithoutToken() {
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(boundPass()));

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, null))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEVICE_MISMATCH);
        verify(deviceSessionService, never()).issue(any(), anyString());
    }

    @Test
    @DisplayName("귀속이 없는 시드 이용권은 쿠키 없이 활성화하면 새 기기 토큰을 발급해 잠근다")
    void activateUnboundPassWithoutToken() {
        Pass pass = Pass.create(CODE, PassType.PERIOD, Instant.now().plus(30, ChronoUnit.DAYS));
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));
        given(deviceSessionService.issue(pass, USER_AGENT))
                .willReturn(new IssuedSession(null, "session-cookie"));

        ActivationResult result = passService.activate(CODE, USER_AGENT, null);

        assertThat(result.cookieValue()).isEqualTo("session-cookie");
        assertThat(pass.getDeviceToken()).isNotNull();
        assertThat(result.deviceCookieValue()).isEqualTo(pass.getDeviceToken());
    }

    @Test
    @DisplayName("귀속이 없는 이용권은 최초 활성화한 기기에 잠기고 이후 다른 기기는 거부된다")
    void activateUnboundPassLocksToFirstDevice() {
        Pass pass = Pass.create(CODE, PassType.PERIOD, Instant.now().plus(30, ChronoUnit.DAYS));
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));
        given(deviceSessionService.issue(pass, USER_AGENT))
                .willReturn(new IssuedSession(null, "session-cookie"));

        ActivationResult result = passService.activate(CODE, USER_AGENT, DEVICE_TOKEN);

        assertThat(pass.getDeviceToken()).isEqualTo(DEVICE_TOKEN);
        assertThat(result.deviceCookieValue()).isNull();
        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, "other-token"))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DEVICE_MISMATCH);
    }

    @Test
    @DisplayName("기기 해제는 귀속을 지우고 활성 세션을 종료한다")
    void unbindDeviceClearsBindingAndKillsSessions() {
        Pass pass = boundPass();
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        passService.unbindDevice(CODE);

        assertThat(pass.getDeviceToken()).isNull();
        verify(deviceSessionService).killActiveSessions(pass);
    }

    @Test
    @DisplayName("존재하지 않는 코드는 PASS_NOT_FOUND로 거부한다")
    void activateUnknownCode() {
        given(passRepository.findByCode(CODE)).willReturn(Optional.empty());

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, DEVICE_TOKEN))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.PASS_NOT_FOUND);
    }

    @Test
    @DisplayName("만료된 이용권은 기기 토큰이 일치해도 PASS_EXPIRED로 거부한다")
    void activateExpiredPass() {
        Pass pass = Pass.create(CODE, PassType.TIME, Instant.now().minus(1, ChronoUnit.HOURS));
        pass.bindDevice(DEVICE_TOKEN);
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, DEVICE_TOKEN))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.PASS_EXPIRED);
        verify(deviceSessionService, never()).issue(any(), anyString());
    }

    @Test
    @DisplayName("이용권을 강제 취소하면 취소 시각과 사유가 기록되고 활성 세션이 종료된다")
    void revokeRecordsReasonAndKillsSessions() {
        Pass pass = boundPass();
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        passService.revoke(CODE, REASON);

        assertThat(pass.isRevoked()).isTrue();
        assertThat(pass.getRevokedAt()).isNotNull();
        assertThat(pass.getRevokeReason()).isEqualTo(REASON);
        verify(deviceSessionService).killActiveSessions(pass);
    }

    @Test
    @DisplayName("이미 취소된 이용권을 다시 취소하면 최초 사유가 유지되고 세션 종료는 수행된다")
    void revokeAlreadyRevokedPassKeepsFirstReason() {
        Pass pass = boundPass();
        pass.revoke(REASON);
        Instant firstRevokedAt = pass.getRevokedAt();
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        passService.revoke(CODE, "다른 사유");

        assertThat(pass.getRevokeReason()).isEqualTo(REASON);
        assertThat(pass.getRevokedAt()).isEqualTo(firstRevokedAt);
        verify(deviceSessionService).killActiveSessions(pass);
    }

    @Test
    @DisplayName("존재하지 않는 코드를 강제 취소하면 PASS_NOT_FOUND로 거부한다")
    void revokeUnknownCode() {
        given(passRepository.findByCode(CODE)).willReturn(Optional.empty());

        assertThatThrownBy(() -> passService.revoke(CODE, REASON))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.PASS_NOT_FOUND);
        verify(deviceSessionService, never()).killActiveSessions(any());
    }

    @Test
    @DisplayName("취소된 이용권을 활성화하면 PASS_REVOKED와 취소 사유를 담아 거부한다")
    void activateRevokedPass() {
        Pass pass = boundPass();
        pass.revoke(REASON);
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, DEVICE_TOKEN))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining(REASON)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.PASS_REVOKED);
        verify(deviceSessionService, never()).issue(any(), anyString());
    }

    @Test
    @DisplayName("취소된 이용권은 만료 전이라도 PASS_REVOKED가 만료 검사보다 먼저 적용된다")
    void activateRevokedPassBeforeExpiryCheck() {
        Pass pass = Pass.create(CODE, PassType.TIME, Instant.now().minus(1, ChronoUnit.HOURS));
        pass.bindDevice(DEVICE_TOKEN);
        pass.revoke(REASON);
        given(passRepository.findByCode(CODE)).willReturn(Optional.of(pass));

        assertThatThrownBy(() -> passService.activate(CODE, USER_AGENT, DEVICE_TOKEN))
                .isInstanceOf(ApiException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.PASS_REVOKED);
    }

    private Pass boundPass() {
        Pass pass = Pass.create(CODE, PassType.PERIOD, Instant.now().plus(30, ChronoUnit.DAYS));
        pass.bindDevice(DEVICE_TOKEN);
        return pass;
    }
}

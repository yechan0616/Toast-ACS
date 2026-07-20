package com.toastacs.api.domain.session;

import com.toastacs.api.global.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "session_kill_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SessionKillLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pass_id", nullable = false)
    private Long passId;

    @Column(name = "old_session", nullable = false)
    private Long oldSessionId;

    public static SessionKillLog of(Long passId, Long oldSessionId) {
        SessionKillLog log = new SessionKillLog();
        log.passId = passId;
        log.oldSessionId = oldSessionId;
        return log;
    }
}

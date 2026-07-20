package com.toastacs.api.domain.entry;

import com.toastacs.api.global.common.BaseTimeEntity;
import com.toastacs.api.global.error.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "entry_log")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EntryLog extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pass_id")
    private Long passId;

    @Column(name = "session_id")
    private Long sessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Direction direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private EntryResult result;

    @Column(name = "deny_code", length = 32)
    private String denyCode;

    public static EntryLog allowed(Long passId, Long sessionId, Direction direction) {
        EntryLog log = new EntryLog();
        log.passId = passId;
        log.sessionId = sessionId;
        log.direction = direction;
        log.result = EntryResult.ALLOWED;
        return log;
    }

    public static EntryLog denied(Long passId, Long sessionId, Direction direction, ErrorCode denyCode) {
        EntryLog log = new EntryLog();
        log.passId = passId;
        log.sessionId = sessionId;
        log.direction = direction;
        log.result = EntryResult.DENIED;
        log.denyCode = denyCode.name();
        return log;
    }
}

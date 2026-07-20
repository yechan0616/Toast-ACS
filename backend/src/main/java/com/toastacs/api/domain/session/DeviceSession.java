package com.toastacs.api.domain.session;

import com.toastacs.api.domain.pass.Pass;
import com.toastacs.api.global.common.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "device_session")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DeviceSession extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "pass_id")
    private Pass pass;

    @Column(nullable = false, length = 64)
    private String secret;

    @Column(name = "last_used_window")
    private Long lastUsedWindow;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    public static DeviceSession create(Pass pass, String secret, String userAgent) {
        DeviceSession session = new DeviceSession();
        session.pass = pass;
        session.secret = secret;
        session.userAgent = userAgent == null ? null : userAgent.substring(0, Math.min(userAgent.length(), 255));
        return session;
    }

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public void kill() {
        if (revokedAt == null) {
            revokedAt = Instant.now();
        }
    }
}

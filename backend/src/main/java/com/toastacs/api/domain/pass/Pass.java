package com.toastacs.api.domain.pass;

import com.toastacs.api.global.common.BaseTimeEntity;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "pass")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pass extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PassType type;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean inside;

    @Column(name = "device_token", length = 64)
    private String deviceToken;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @Column(name = "revoke_reason", length = 500)
    private String revokeReason;

    public static Pass create(String code, PassType type, Instant expiresAt) {
        Pass pass = new Pass();
        pass.code = code;
        pass.type = type;
        pass.expiresAt = expiresAt;
        pass.inside = false;
        return pass;
    }

    public boolean isExpired(Instant now) {
        return expiresAt.isBefore(now);
    }

    public boolean isRevoked() {
        return revokedAt != null;
    }

    public void revoke(String reason) {
        if (revokedAt != null) {
            return;
        }
        revokedAt = Instant.now();
        revokeReason = reason;
    }

    public boolean isBoundToOtherDevice(String candidateToken) {
        return deviceToken != null && !deviceToken.equals(candidateToken);
    }

    void bindDevice(String deviceToken) {
        this.deviceToken = deviceToken;
    }

    public void enter() {
        if (inside) {
            throw new ApiException(ErrorCode.ALREADY_INSIDE);
        }
        inside = true;
    }

    public void exit() {
        if (!inside) {
            throw new ApiException(ErrorCode.NOT_INSIDE);
        }
        inside = false;
    }
}

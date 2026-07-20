package com.toastacs.api.domain.pass;

import com.toastacs.api.global.common.BaseTimeEntity;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "pass_request")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PassRequest extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    private UUID publicId;

    @Column(name = "applicant_name", nullable = false, length = 50)
    private String applicantName;

    @Column(length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "pass_type", length = 16)
    private PassType passType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private PassRequestStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pass_id")
    private Pass pass;

    @Column(name = "decided_at")
    private Instant decidedAt;

    @Column(length = 45)
    private String ip;

    @Column(length = 500)
    private String reason;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Column(name = "device_token", length = 64)
    private String deviceToken;

    public static PassRequest create(String applicantName, String phone, String ip, String reason) {
        PassRequest request = new PassRequest();
        request.publicId = UUID.randomUUID();
        request.applicantName = applicantName;
        request.phone = phone;
        request.status = PassRequestStatus.PENDING;
        request.ip = ip;
        request.reason = reason;
        request.deviceToken = UUID.randomUUID().toString();
        return request;
    }

    public void approve(Pass pass) {
        ensurePending();
        pass.bindDevice(deviceToken);
        this.pass = pass;
        this.passType = pass.getType();
        this.status = PassRequestStatus.APPROVED;
        this.decidedAt = Instant.now();
    }

    public void reject(String rejectReason) {
        ensurePending();
        this.status = PassRequestStatus.REJECTED;
        this.rejectReason = rejectReason;
        this.decidedAt = Instant.now();
    }

    private void ensurePending() {
        if (status != PassRequestStatus.PENDING) {
            throw new ApiException(ErrorCode.ALREADY_DECIDED);
        }
    }
}

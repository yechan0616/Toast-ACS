package com.toastacs.api.domain.gate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "gate_state")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GateState {

    @Id
    private Short id;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;

    @Column(name = "ultrasonic_at")
    private Instant ultrasonicAt;

    @Column(name = "pending_open", nullable = false)
    private boolean pendingOpen;

    @Column(name = "pending_alarm", nullable = false)
    private boolean pendingAlarm;

    public void heartbeat(Instant now) {
        this.lastSeenAt = now;
    }

    public void detectPresence(Instant now) {
        this.ultrasonicAt = now;
    }

    public void queueOpen() {
        this.pendingOpen = true;
    }

    public void queueAlarm() {
        this.pendingAlarm = true;
    }

    public boolean consumeOpen() {
        boolean open = pendingOpen;
        pendingOpen = false;
        return open;
    }

    public boolean consumeAlarm() {
        boolean alarm = pendingAlarm;
        pendingAlarm = false;
        return alarm;
    }
}

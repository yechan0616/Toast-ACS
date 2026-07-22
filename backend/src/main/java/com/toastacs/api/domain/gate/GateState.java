package com.toastacs.api.domain.gate;

import com.toastacs.api.domain.entry.Direction;
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

    @Column(name = "ultrasonic_in_at")
    private Instant ultrasonicInAt;

    @Column(name = "ultrasonic_out_at")
    private Instant ultrasonicOutAt;

    @Column(name = "pending_open_in", nullable = false)
    private boolean pendingOpenIn;

    @Column(name = "pending_open_out", nullable = false)
    private boolean pendingOpenOut;

    @Column(name = "pending_alarm", nullable = false)
    private boolean pendingAlarm;

    @Column(name = "pending_seat", length = 10)
    private String pendingSeat;

    @Column(name = "pending_deny_in", length = 40)
    private String pendingDenyIn;

    @Column(name = "pending_deny_out", length = 40)
    private String pendingDenyOut;

    public void heartbeat(Instant now) {
        this.lastSeenAt = now;
    }

    public void detectPresence(Direction direction, Instant now) {
        if (direction == Direction.IN) {
            this.ultrasonicInAt = now;
        } else {
            this.ultrasonicOutAt = now;
        }
    }

    public Instant getUltrasonicAt(Direction direction) {
        return direction == Direction.IN ? ultrasonicInAt : ultrasonicOutAt;
    }

    public void queueOpen(Direction direction, String seat) {
        if (direction == Direction.IN) {
            this.pendingOpenIn = true;
            this.pendingSeat = seat;
        } else {
            this.pendingOpenOut = true;
        }
    }

    public void queueAlarm() {
        this.pendingAlarm = true;
    }

    public void queueDeny(Direction direction, String label) {
        if (direction == Direction.IN) {
            this.pendingDenyIn = label;
        } else {
            this.pendingDenyOut = label;
        }
    }

    public String consumeDeny(Direction direction) {
        if (direction == Direction.IN) {
            String label = pendingDenyIn;
            pendingDenyIn = null;
            return label;
        }
        String label = pendingDenyOut;
        pendingDenyOut = null;
        return label;
    }

    public boolean consumeOpen(Direction direction) {
        if (direction == Direction.IN) {
            boolean open = pendingOpenIn;
            pendingOpenIn = false;
            return open;
        }
        boolean open = pendingOpenOut;
        pendingOpenOut = false;
        return open;
    }

    public boolean consumeAlarm() {
        boolean alarm = pendingAlarm;
        pendingAlarm = false;
        return alarm;
    }

    public String consumeSeat() {
        String seat = pendingSeat;
        pendingSeat = null;
        return seat;
    }
}

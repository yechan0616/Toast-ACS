ALTER TABLE gate_state RENAME COLUMN ultrasonic_at TO ultrasonic_in_at;
ALTER TABLE gate_state ADD COLUMN ultrasonic_out_at TIMESTAMPTZ;
ALTER TABLE gate_state RENAME COLUMN pending_open TO pending_open_in;
ALTER TABLE gate_state ADD COLUMN pending_open_out BOOLEAN NOT NULL DEFAULT FALSE;

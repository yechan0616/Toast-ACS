CREATE TABLE pass (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(32) NOT NULL UNIQUE,
    type        VARCHAR(16) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    inside      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE device_session (
    id               BIGSERIAL PRIMARY KEY,
    pass_id          BIGINT      NOT NULL REFERENCES pass(id),
    secret           VARCHAR(64) NOT NULL,
    last_used_window BIGINT,
    user_agent       VARCHAR(255),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at       TIMESTAMPTZ
);
CREATE UNIQUE INDEX ux_session_active ON device_session (pass_id) WHERE revoked_at IS NULL;

CREATE TABLE entry_log (
    id          BIGSERIAL PRIMARY KEY,
    pass_id     BIGINT      REFERENCES pass(id),
    session_id  BIGINT      REFERENCES device_session(id),
    direction   VARCHAR(8)  NOT NULL,
    result      VARCHAR(16) NOT NULL,
    deny_code   VARCHAR(32),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE session_kill_log (
    id          BIGSERIAL PRIMARY KEY,
    pass_id     BIGINT      NOT NULL REFERENCES pass(id),
    old_session BIGINT      NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alert (
    id          BIGSERIAL PRIMARY KEY,
    type        VARCHAR(32) NOT NULL,
    detail      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE gate_state (
    id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    last_seen_at   TIMESTAMPTZ,
    ultrasonic_at  TIMESTAMPTZ,
    pending_open   BOOLEAN NOT NULL DEFAULT FALSE,
    pending_alarm  BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE admin_account (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(32)  NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL
);

INSERT INTO gate_state (id) VALUES (1);

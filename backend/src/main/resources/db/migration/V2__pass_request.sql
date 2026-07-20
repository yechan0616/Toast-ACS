CREATE TABLE pass_request (
    id             BIGSERIAL PRIMARY KEY,
    public_id      UUID        NOT NULL UNIQUE,
    applicant_name VARCHAR(50) NOT NULL,
    pass_type      VARCHAR(16) NOT NULL,
    status         VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    pass_id        BIGINT      REFERENCES pass(id),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    decided_at     TIMESTAMPTZ
);

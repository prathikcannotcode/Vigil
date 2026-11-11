CREATE TABLE borrowers (
    id             BIGSERIAL PRIMARY KEY,
    phone          TEXT NOT NULL UNIQUE,
    email          TEXT,
    full_name      TEXT NOT NULL,
    date_of_birth  DATE NOT NULL,
    address        TEXT,
    pan_masked     TEXT,
    employer       TEXT,
    monthly_income INTEGER,
    offers_opt_in  BOOLEAN NOT NULL DEFAULT false,
    aa_handle      TEXT,
    nominee        JSONB,
    status        TEXT NOT NULL DEFAULT 'active',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at      TIMESTAMPTZ
);

CREATE TABLE consent_events (
    id             BIGSERIAL PRIMARY KEY,
    borrower_id    BIGINT NOT NULL REFERENCES borrowers(id),
    purpose        TEXT NOT NULL,
    granted        BOOLEAN NOT NULL,
    notice_version TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

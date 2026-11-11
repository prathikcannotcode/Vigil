CREATE TABLE applications (
    id            BIGSERIAL PRIMARY KEY,
    borrower_id   BIGINT NOT NULL REFERENCES borrowers(id),
    amount        INTEGER NOT NULL,
    tenure_months INTEGER NOT NULL,
    status        TEXT NOT NULL,          -- submitted | approved | rejected | withdrawn
    decided_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE loans (
    id             BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id),
    borrower_id    BIGINT NOT NULL REFERENCES borrowers(id),
    principal      INTEGER NOT NULL,
    outstanding    INTEGER NOT NULL,
    dpd            INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL,         -- open | closed | written_off
    disbursed_at   TIMESTAMPTZ NOT NULL,
    closed_at      TIMESTAMPTZ
);

CREATE TABLE preapproved_offers (
    borrower_id BIGINT PRIMARY KEY REFERENCES borrowers(id),
    limit_inr   INTEGER NOT NULL,
    computed_at TIMESTAMPTZ NOT NULL
);

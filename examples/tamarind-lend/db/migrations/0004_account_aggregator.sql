CREATE TABLE aa_consents (
    id              BIGSERIAL PRIMARY KEY,
    borrower_id     BIGINT NOT NULL REFERENCES borrowers(id),
    application_id  BIGINT NOT NULL REFERENCES applications(id),
    consent_handle  TEXT NOT NULL UNIQUE,
    fetch_type      TEXT NOT NULL,
    data_life_unit  TEXT NOT NULL,
    data_life_value INTEGER NOT NULL,
    consent_expiry  TIMESTAMPTZ NOT NULL,
    status          TEXT NOT NULL,        -- requested | active | revoked | expired
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bank_statements (
    id             BIGSERIAL PRIMARY KEY,
    borrower_id    BIGINT NOT NULL REFERENCES borrowers(id),
    aa_consent_id  BIGINT NOT NULL REFERENCES aa_consents(id),
    account_masked TEXT NOT NULL,
    fi_payload     JSONB NOT NULL,
    fetched_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

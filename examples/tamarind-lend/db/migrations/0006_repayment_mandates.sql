CREATE TABLE repayment_mandates (
    id            BIGSERIAL PRIMARY KEY,
    loan_id       BIGINT NOT NULL REFERENCES loans(id),
    method        TEXT NOT NULL,          -- card | upi_autopay | enach
    pa_token_ref  TEXT,                   -- reference to the payment aggregator's token for the card
    card_last4    CHAR(4),
    card_network  TEXT,
    expiry_month  SMALLINT,
    expiry_year   SMALLINT,
    umrn          TEXT,                   -- e-mandate reference
    status        TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

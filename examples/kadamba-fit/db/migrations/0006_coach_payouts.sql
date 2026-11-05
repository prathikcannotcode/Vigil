CREATE TABLE coach_payouts (
  id BIGSERIAL PRIMARY KEY,
  coach_id BIGINT NOT NULL,
  region TEXT NOT NULL,
  tax_id_sealed BYTEA NOT NULL,
  bank_account_sealed BYTEA NOT NULL,
  key_alias TEXT NOT NULL DEFAULT 'alias/coach-payouts',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

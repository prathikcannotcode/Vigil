CREATE TABLE payment_tokens (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id),
  psp_token TEXT NOT NULL,
  card_brand TEXT NOT NULL,
  card_last4 CHAR(4) NOT NULL,
  expires_on DATE NOT NULL
);

CREATE TABLE invoices (
  id BIGSERIAL PRIMARY KEY,
  member_ref UUID NOT NULL,
  billing_name TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  tax_number TEXT,
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

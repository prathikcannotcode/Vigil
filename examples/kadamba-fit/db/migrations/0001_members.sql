CREATE TABLE members (
  id BIGSERIAL PRIMARY KEY,
  ref UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  region TEXT NOT NULL CHECK (region IN ('in', 'eu')),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  dob DATE NOT NULL,
  guardian_id BIGINT REFERENCES members(id),
  is_minor BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  nominee JSONB,
  push_token TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_sessions (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id),
  token_hash BYTEA NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

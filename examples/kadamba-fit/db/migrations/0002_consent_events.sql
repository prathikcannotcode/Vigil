CREATE TABLE consent_events (
  id BIGSERIAL PRIMARY KEY,
  member_ref UUID NOT NULL,
  purpose TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  notice_version TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX consent_events_member_purpose ON consent_events (member_ref, purpose, created_at DESC);

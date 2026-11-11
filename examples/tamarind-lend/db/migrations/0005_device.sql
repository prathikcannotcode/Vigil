CREATE TABLE contact_graph (
    id             BIGSERIAL PRIMARY KEY,
    borrower_id    BIGINT NOT NULL REFERENCES borrowers(id),
    contact_name   TEXT,
    contact_phone  TEXT NOT NULL,
    call_count_90d INTEGER NOT NULL DEFAULT 0,
    is_reference   BOOLEAN NOT NULL DEFAULT false,
    uploaded_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE device_locations (
    id          BIGSERIAL PRIMARY KEY,
    borrower_id BIGINT NOT NULL REFERENCES borrowers(id),
    lat         NUMERIC(8, 5) NOT NULL,
    lon         NUMERIC(8, 5) NOT NULL,
    accuracy_m  REAL,
    captured_at TIMESTAMPTZ NOT NULL
);

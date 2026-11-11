CREATE TABLE kyc_records (
    id                BIGSERIAL PRIMARY KEY,
    borrower_id       BIGINT NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    method            TEXT NOT NULL,      -- ovd_upload | digilocker
    doc_type          TEXT NOT NULL,      -- aadhaar | passport | voter_id | driving_licence
    doc_number_masked TEXT NOT NULL,
    document_key      TEXT,               -- object storage prefix for the uploaded images
    selfie_key        TEXT,
    verified_at       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KYC storage
CREATE TABLE kyc_documents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  aadhaar_number VARCHAR(12) NOT NULL,
  pan_number VARCHAR(10) NOT NULL,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

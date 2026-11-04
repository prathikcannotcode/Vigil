-- Card tokens live with the PSP. The bank account number is envelope-encrypted with a KMS key before insert.
CREATE TABLE payout_accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  account_ciphertext BYTEA NOT NULL,
  kms_key_id TEXT NOT NULL
);

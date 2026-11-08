---
name: pii-scan
description: "Scan codebases, schemas, logs and configs for personal data (DPDP s.2(t), GDPR Art. 4(1) and 9) including Aadhaar, PAN and UPI IDs, reporting locations only, never values. Use for \"scan for PII\", \"find personal data\", \"data discovery\"."
---

# PII Scanner

## Trigger

"scan for PII", "find personal data", "personal data scan", "PII detection", "sensitive data scan", "data discovery"

## Purpose

Scan codebases, databases, APIs, logs, and configuration files for personal data. Works for both DPDP (personal data as defined in Section 2(t)) and GDPR (Art. 4(1)) compliance.

## What to scan

### Code and configuration
- Database schemas and migration files (column names, table names)
- API request/response definitions (OpenAPI specs, GraphQL schemas, protobuf)
- Form definitions and input fields
- Environment variables and config files
- Log statements and log format definitions
- Test fixtures and seed data (often contain real-looking PII)
- Comments and documentation (sometimes contain real data)

### Patterns to detect

**Direct identifiers:**
- Names (first, last, full)
- Email addresses
- Phone numbers
- IP addresses
- Device IDs, advertising IDs
- Government IDs: Aadhaar, PAN, passport, SSN, national ID
- Financial: bank account, credit card, UPI ID
- Addresses (postal)
- Dates of birth
- Usernames and login credentials

**Special category / sensitive data (GDPR Art. 9, DPDP Section 2(t)):**
- Health and medical data
- Biometric data
- Genetic data
- Racial or ethnic origin
- Political opinions
- Religious or philosophical beliefs
- Trade union membership
- Sexual orientation
- Criminal records

**Indirect identifiers (re-identification risk):**
- Location data (GPS, cell tower, postcode)
- Behavioural data (browsing history, purchase history)
- Device fingerprints
- Combinations of quasi-identifiers

## Detection approach

1. **Pattern matching:** regex for structured identifiers (email, phone, Aadhaar, PAN, credit card, IP)
2. **Column/field name heuristics:** flag fields named `name`, `email`, `phone`, `dob`, `address`, `ssn`, `aadhaar`, `pan`, `ip_address`, `user_agent`, etc.
3. **Log scanning:** check log output for PII leakage
4. **Config review:** check for hardcoded PII in configuration
5. **Test data review:** check fixtures for production-like PII

## Output

For each finding:
- File path and line number
- Type of personal data detected
- Classification: direct identifier / special category / indirect identifier
- Framework relevance: DPDP / GDPR / both
- Recommendation: encrypt, pseudonymise, remove, document

## Guardrails

- Never extract or copy actual personal data into findings. Reference by location only.
- File a finding for test fixtures containing realistic-format identifiers (DPDP s.8(5), GDPR Art. 5(1)(f)), even when a README or comment calls them synthetic. Rate it low on that claim alone and say it was not verified. Without the claim, rate it by the risk, because the values may be real.
- Do not treat every string as PII. Focus on structured patterns and context.

## Commands

Invoke the skill directly, or describe the task in plain English and Claude picks it up.

| Run | Action |
|---|---|
| `/pii-scan` | Scan codebase for personal data |
| `/pii-scan logs` | Scan log configurations for PII leakage |
| `/pii-scan db` | Scan database schemas for personal data columns |

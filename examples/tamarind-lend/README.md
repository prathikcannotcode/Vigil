# Tamarind (synthetic)

A made-up digital lending app. Salaried borrowers in India apply for small personal loans on an Android app, complete KYC, share bank statements through an account aggregator and repay by card, UPI Autopay or e-mandate. Overdue accounts go to an in-house collections team and then to an outside collections agency.

Nothing here is real. There are no real people, personal data, credentials or companies, every domain is reserved for documentation, every identifier-shaped value is deliberately invalid, and the code does not run.

## Company facts

| | |
|---|---|
| Legal entity | Tamarind Finserv Private Limited, 7 Example Road, Pune 411001 |
| Sector | Fintech: a non-banking financial company registered with the Reserve Bank of India, lending through its own app |
| RBI registration | Synthetic placeholder N-00.00000 |
| Borrowers | About 350,000 applicants and borrowers, all resident in India |
| Products | Personal loans of Rs 5,000 to Rs 2,00,000 over 3 to 24 months, for applicants aged 21 to 58 with an Indian PAN and address |
| Outside India | No establishment, staff or customers outside India |
| Turnover | About Rs 180 crore |
| Significant Data Fiduciary | Not designated |
| Grievance redressal officer | grievance@tamarind.example, Pune |
| Data protection contact | privacy@tamarind.example, Pune. No DPO has been appointed |
| Vendors | Listed in `docs/vendors/register.md` |

## Where things are

- `android/`: the borrower app (manifest, Gradle build, onboarding and device code)
- `api/`, `services/`, `jobs/`: the backend
- `db/migrations/`: the schema
- `web/`: the public privacy policy
- `config/`, `deploy/`: runtime settings, roles, backups and logging
- `docs/`: retention schedule, incident runbook and vendor documents

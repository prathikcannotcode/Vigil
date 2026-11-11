# Retention schedule

Owner: Compliance. Approved by the Risk Management Committee, April 2026.

| Data | Kept for | Why | How it is deleted |
|---|---|---|---|
| KYC records and document images | 5 years after the borrower's last loan closes | RBI KYC Direction, record management | `jobs/retention.py` |
| Loan and repayment records | 5 years after each transaction | RBI KYC Direction, record management | Annual archive review |
| Rejected or withdrawn applications, with the applicant's KYC images, bank statements and references | 90 days after the decision | Fraud checks on repeat applications | `jobs/retention.py` |
| Bank statements from the account aggregator | Until the data life in the borrower's consent ends | The borrower's AA consent | `jobs/retention.py` |
| Device locations | 90 days | Fraud checks | `jobs/retention.py` |
| References | Until the loan closes | Collections | Erasure request, or account closure |
| Consent records | 8 years after account closure | Proof of consent | Annual archive review |
| Logs | 400 days | DPDP Rules and CERT-In Directions | Log platform retention |

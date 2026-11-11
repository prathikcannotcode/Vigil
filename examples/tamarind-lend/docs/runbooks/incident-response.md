# Incident response

Owner: Head of Information Security. Applies to every security incident, whether or not personal data is involved.

## First hour

1. Whoever notices the incident pages the security on-call. The on-call opens an incident channel, names an incident commander and writes the time the incident was noticed at the top of the incident document.
2. Contain: revoke credentials, isolate hosts, snapshot affected systems and preserve logs.
3. The security lead reviews the evidence and decides whether the incident is reportable. The decision and its time go in the incident document.

## Regulators and people affected

| Who | When | Owner |
|---|---|---|
| CERT-In | Within 24 hours of the security lead confirming a reportable incident, on the CERT-In incident form by email | Security lead |
| Reserve Bank of India | Within 6 hours of noticing, through the RBI reporting portal | Chief Compliance Officer |
| Data Protection Board of India | Without delay once a personal data breach is known, then the detailed report within 72 hours of becoming aware of it | Data protection contact |
| Every borrower affected | Without delay, by SMS and email: what happened, when, the likely consequences, what we are doing and what they can do, and who to contact | Data protection contact |
| Recoverline, Verilane, Ledgerbridge | Within 24 hours if their systems or our data in them are involved | Vendor manager |

## Afterwards

4. Keep the incident document, the evidence and every notice sent for at least five years.
5. Write a postmortem within 10 working days and track its actions to closure.

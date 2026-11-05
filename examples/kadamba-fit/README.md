# Kadamba Fit (synthetic)

A made-up fitness and cycle-tracking app for members in India and the EU. Members log workouts, sync a wearable, book video sessions with coaches and can earn a wellness discount from a partner insurer. Parents can add their children to a family plan.

Nothing here is real. There are no real people, personal data, credentials or companies, every domain is reserved for documentation, and the code does not run.

## Company facts

| | |
|---|---|
| Legal entities | Kadamba Fit Private Limited, 14 Example Layout, Bengaluru 560001 (India members). Kadamba Fit Ireland Limited, 5 Sample Quay, Dublin 2 (EU members) |
| Sector | Healthtech: a consumer fitness app, not a clinical establishment |
| Members | About 180,000 in India and 45,000 in Ireland and Germany |
| Worldwide turnover | About EUR 6 million |
| Significant Data Fiduciary | Not designated |
| Children | India members under 18 and EU members under 16 join through a parent's family plan |
| Sensitive data | Heart rate, SpO2, sleep, cycle dates and symptoms |
| Data protection officer | dpo@kadamba.example, based in Dublin, with a deputy in Bengaluru |
| DPIA | Wearable and cycle processing, completed 12 March 2026, held by the DPO outside this repository |

## Where things are

- `api/`, `services/`, `jobs/`, `utils/`: the backend
- `db/migrations/`: the schema
- `web/`: signup, settings and the privacy notice
- `config/`, `deploy/`, `scripts/`: runtime settings, Kubernetes manifests and operations scripts
- `docs/`: processing records, retention schedule, vendor contracts and runbooks

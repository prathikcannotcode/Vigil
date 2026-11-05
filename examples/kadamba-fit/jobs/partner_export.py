import requests

from kadamba import db
from kadamba.config import cfg
from kadamba.services import consent_ledger

ROWS = """
SELECT m.ref AS member_ref, m.email, m.dob, m.region, s.week_start, s.step_total,
       s.resting_hr_avg, s.sleep_minutes_avg, s.activity_tier
FROM members m
JOIN weekly_summaries s ON s.member_ref = m.ref
WHERE s.week_start = %s AND m.status = 'active'
"""


def run(week_start):
    """Weekly, Monday 02:00 UTC."""
    for row in db.query(ROWS, week_start):
        if consent_ledger.current(row.member_ref, "wellness_partner"):
            requests.post(cfg.partners.harbourline[row.region], json=dict(row), timeout=10)

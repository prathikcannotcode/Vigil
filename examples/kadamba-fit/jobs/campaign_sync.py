from kadamba import crm, db


def run():
    """Nightly. Keeps the CRM offers lists in step with the member base."""
    rows = db.query("SELECT email, full_name, region FROM members WHERE status = 'active' AND marketing_opt_in")
    for row in rows:
        crm.upsert_contact(row.email, row.full_name, list_name=f"offers-{row.region}")

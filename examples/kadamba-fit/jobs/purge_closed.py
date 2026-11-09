from datetime import timedelta

from kadamba import analytics, crm, db

GRACE_DAYS = 30
ERASE = ["bookings", "route_tracks", "workouts", "auth_sessions", "payment_tokens"]


def erase_member(member):
    for table in ERASE:
        db.execute(f"DELETE FROM {table} WHERE member_id = %s", member.id)
    analytics.delete_profile(member.ref)
    crm.delete_contact(member.email)
    db.execute("DELETE FROM members WHERE id = %s", member.id)


def run(now):
    """Nightly."""
    cutoff = now - timedelta(days=GRACE_DAYS)
    for member in db.query("SELECT * FROM members WHERE status = 'closed' AND closed_at < %s", cutoff):
        erase_member(member)
    db.execute("DELETE FROM invoices WHERE issued_at < %s", now - timedelta(days=9 * 365))
    db.execute(
        "DELETE FROM consent_events WHERE member_ref NOT IN (SELECT ref FROM members) AND created_at < %s",
        now - timedelta(days=3 * 365),
    )
    db.execute(
        "DELETE FROM tickets WHERE member_ref NOT IN (SELECT ref FROM members) AND opened_at < %s",
        now - timedelta(days=3 * 365),
    )

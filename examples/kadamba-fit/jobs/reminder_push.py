from kadamba import db, push
from kadamba.services import consent_ledger


def run():
    """Daily at 07:00 member local time."""
    for member in db.query("SELECT ref, push_token FROM members WHERE status = 'active' AND push_token IS NOT NULL"):
        if consent_ledger.current(member.ref, "reminders"):
            push.send(member.push_token, "Time to move. Your workout is ready.")

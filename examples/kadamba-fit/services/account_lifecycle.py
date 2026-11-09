from kadamba import db


def close_account(member, now):
    """POST /me/close. jobs/purge_closed.py removes the data once the grace period ends."""
    member.update(status="closed", closed_at=now)
    db.execute("DELETE FROM auth_sessions WHERE member_id = %s", member.id)

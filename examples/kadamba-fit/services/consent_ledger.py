from kadamba import db
from kadamba.config import cfg


def record(member_ref, purpose, granted, source):
    db.execute(
        "INSERT INTO consent_events (member_ref, purpose, granted, notice_version, source) VALUES (%s, %s, %s, %s, %s)",
        member_ref, purpose, granted, cfg.notice_version, source,
    )


def current(member_ref, purpose):
    row = db.one(
        "SELECT granted FROM consent_events WHERE member_ref = %s AND purpose = %s ORDER BY created_at DESC LIMIT 1",
        member_ref, purpose,
    )
    return bool(row and row.granted)

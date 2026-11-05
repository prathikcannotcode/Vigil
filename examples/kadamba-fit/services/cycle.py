from datetime import timedelta

from kadamba import db


def log_cycle(member, start_date, symptoms, notes=None):
    """POST /me/cycles"""
    db.execute(
        "INSERT INTO cycle_logs (member_ref, start_date, symptoms, notes) VALUES (%s, %s, %s, %s)",
        member.ref, start_date, symptoms, notes,
    )
    return predict_next(member)


def predict_next(member):
    rows = db.query("SELECT start_date FROM cycle_logs WHERE member_ref = %s ORDER BY start_date DESC LIMIT 6", member.ref)
    if len(rows) < 2:
        return None
    gaps = [(a.start_date - b.start_date).days for a, b in zip(rows, rows[1:])]
    return rows[0].start_date + timedelta(days=round(sum(gaps) / len(gaps)))

from datetime import time

from tamarind import db, sms

SEND_WINDOW = (time(8, 0), time(19, 0))


def run(now):
    """Every morning at 09:30 IST."""
    if not SEND_WINDOW[0] <= now.time() <= SEND_WINDOW[1]:
        return
    rows = db.query(
        """
        SELECT l.id, l.dpd, l.outstanding, b.phone
        FROM loans l JOIN borrowers b ON b.id = l.borrower_id
        WHERE l.status = 'open' AND l.dpd BETWEEN 1 AND 59
        """
    )
    for row in rows:
        sms.send(row["phone"], template="emi_overdue", loan_id=row["id"], amount=row["outstanding"], dpd=row["dpd"])

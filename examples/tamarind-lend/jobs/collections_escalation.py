from datetime import time

from tamarind import db, sms

SEND_WINDOW = (time(8, 0), time(19, 0))
ESCALATE_FROM_DPD = 15
NUDGES_PER_LOAN = 5


def run(now):
    """Every morning at 10:00 IST."""
    if not SEND_WINDOW[0] <= now.time() <= SEND_WINDOW[1]:
        return
    loans = db.query(
        """
        SELECT l.id, l.borrower_id, b.full_name
        FROM loans l JOIN borrowers b ON b.id = l.borrower_id
        WHERE l.status = 'open' AND l.dpd >= %s
        """,
        ESCALATE_FROM_DPD,
    )
    for loan in loans:
        contacts = db.query(
            """
            SELECT contact_phone FROM contact_graph
            WHERE borrower_id = %s
            ORDER BY is_reference DESC, call_count_90d DESC
            LIMIT %s
            """,
            loan["borrower_id"],
            NUDGES_PER_LOAN,
        )
        for contact in contacts:
            sms.send(contact["contact_phone"], template="reference_nudge", borrower_name=loan["full_name"])

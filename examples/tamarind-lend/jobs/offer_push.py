from tamarind import db, push


def run(now):
    """Monthly, 2nd at 11:00 IST."""
    rows = db.query(
        """
        SELECT o.borrower_id, o.limit_inr
        FROM preapproved_offers o JOIN borrowers b ON b.id = o.borrower_id
        WHERE b.offers_opt_in AND b.status = 'active'
        """
    )
    for row in rows:
        push.send(row["borrower_id"], template="topup_offer", limit=row["limit_inr"])

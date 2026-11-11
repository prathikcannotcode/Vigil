from tamarind import db
from tamarind.models import topup

from .features import statement_features


def run(now):
    """Monthly, 1st at 03:00 IST: refresh pre-approved top-up limits."""
    borrowers = db.query("SELECT id FROM borrowers WHERE status IN ('active', 'closed')")
    for borrower in borrowers:
        statements = db.query(
            "SELECT fi_payload, fetched_at FROM bank_statements WHERE borrower_id = %s ORDER BY fetched_at",
            borrower["id"],
        )
        if not statements:
            continue
        repayments = db.query(
            "SELECT principal, dpd, status, disbursed_at, closed_at FROM loans WHERE borrower_id = %s",
            borrower["id"],
        )
        limit = topup.score(statement_features(statements), repayments)
        if limit:
            db.upsert("preapproved_offers", key="borrower_id", borrower_id=borrower["id"], limit_inr=limit, computed_at=now)

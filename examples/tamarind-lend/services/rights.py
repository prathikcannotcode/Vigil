from tamarind import db
from tamarind.clock import now
from tamarind.vendors import register

EXPORT_TABLES = [
    "consent_events",
    "applications",
    "loans",
    "kyc_records",
    "aa_consents",
    "bank_statements",
    "contact_graph",
    "device_locations",
    "repayment_mandates",
]

ERASE = ["contact_graph", "device_locations", "bank_statements", "aa_consents", "preapproved_offers"]

RETAINED = {
    "kyc_records": "Identity and address records are kept for five years after your last loan closes, as RBI's KYC rules require.",
    "loans": "Loan and repayment records are kept for five years after each transaction, as RBI's KYC rules require.",
    "consent_events": "Records of the consents you gave and withdrew are kept as proof of consent.",
}


class RightsError(Exception):
    pass


def export(borrower):
    """GET /v1/me/data"""
    data = {"profile": db.one("SELECT * FROM borrowers WHERE id = %s", borrower.id)}
    for table in EXPORT_TABLES:
        column = "loan_id IN (SELECT id FROM loans WHERE borrower_id = %s)" if table == "repayment_mandates" else "borrower_id = %s"
        data[table] = db.query(f"SELECT * FROM {table} WHERE {column}", borrower.id)
    data["shared_with"] = register.recipients()
    return data


def correct(borrower, changes):
    """PATCH /v1/me"""
    allowed = {"email", "address", "employer", "monthly_income"}
    updates = {key: value for key, value in changes.items() if key in allowed}
    if updates:
        db.update("borrowers", borrower.id, **updates)


def erase(borrower):
    """DELETE /v1/me"""
    open_loans = db.scalar("SELECT count(*) FROM loans WHERE borrower_id = %s AND status = 'open'", borrower.id)
    if open_loans:
        raise RightsError("You have a loan that is still open. We can erase your data once it is repaid.")
    for table in ERASE:
        db.execute(f"DELETE FROM {table} WHERE borrower_id = %s", borrower.id)
    db.execute(
        "UPDATE borrowers SET email = NULL, offers_opt_in = false, status = 'closed', closed_at = %s WHERE id = %s",
        now(),
        borrower.id,
    )
    return {"erased": ERASE, "retained": RETAINED}


def set_nominee(borrower, name, contact):
    """PUT /v1/me/nominee"""
    db.update("borrowers", borrower.id, nominee={"name": name, "contact": contact})

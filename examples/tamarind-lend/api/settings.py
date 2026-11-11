from tamarind import db
from tamarind.auth import current_borrower

NOTICE_VERSION = "2026-04"


def get_preferences():
    """GET /v1/me/preferences"""
    borrower = current_borrower()
    return {"offers": borrower.offers_opt_in}


def set_offers(opt_in):
    """PUT /v1/me/preferences/offers

    The app shows this as one switch on the Profile screen, the same switch used at signup.
    """
    borrower = current_borrower()
    db.execute("UPDATE borrowers SET offers_opt_in = %s WHERE id = %s", bool(opt_in), borrower.id)
    db.insert(
        "consent_events",
        borrower_id=borrower.id,
        purpose="offers",
        granted=bool(opt_in),
        notice_version=NOTICE_VERSION,
    )

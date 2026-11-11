import json
import logging
from datetime import timedelta

from tamarind import db
from tamarind.clock import now
from tamarind.vendors import ledgerbridge_aa as aa

from .statements import StatementParseError, parse_statement

log = logging.getLogger("tamarind.aa")

CONSENT_TEMPLATE = {
    "consentMode": "STORE",
    "fetchType": "ONETIME",
    "consentTypes": ["PROFILE", "SUMMARY", "TRANSACTIONS"],
    "fiTypes": ["DEPOSIT"],
    "Purpose": {"text": "Assess your loan application"},
    "FIDataRange": {"monthsBack": 6},
    "DataLife": {"unit": "MONTH", "value": 1},
}


def request_consent(borrower, application):
    """Called when the borrower taps 'Share bank statement' on the application."""
    expiry = now() + timedelta(days=7)
    handle = aa.create_consent(
        customer_vua=borrower.aa_handle,
        template=CONSENT_TEMPLATE,
        consent_expiry=expiry,
    )
    db.insert(
        "aa_consents",
        borrower_id=borrower.id,
        application_id=application.id,
        consent_handle=handle,
        fetch_type=CONSENT_TEMPLATE["fetchType"],
        data_life_unit=CONSENT_TEMPLATE["DataLife"]["unit"],
        data_life_value=CONSENT_TEMPLATE["DataLife"]["value"],
        consent_expiry=expiry,
        status="requested",
    )
    return handle


def handle_fi_ready(notification):
    """POST /v1/aa/notifications (FI ready)"""
    consent = db.one("SELECT * FROM aa_consents WHERE consent_handle = %s", notification["consentHandle"])
    payload = aa.fetch_fi(notification["sessionId"])  # decrypted account profile, summary and transactions
    try:
        statement = parse_statement(payload)
    except StatementParseError as exc:
        log.warning("fi parse failed consent=%s err=%s payload=%s", consent["id"], exc, json.dumps(payload))
        raise
    db.insert(
        "bank_statements",
        borrower_id=consent["borrower_id"],
        aa_consent_id=consent["id"],
        account_masked=statement.account_masked,
        fi_payload=payload,
    )
    db.execute("UPDATE aa_consents SET status = 'active' WHERE id = %s", consent["id"])

from tamarind import db
from tamarind.auth import current_borrower
from tamarind.clock import now


def record_consent(purpose, granted, notice_version):
    """POST /v1/consents"""
    borrower = current_borrower()
    db.insert(
        "consent_events",
        borrower_id=borrower.id,
        purpose=purpose,
        granted=granted,
        notice_version=notice_version,
    )


def upload_contact_graph(rows):
    """POST /v1/onboarding/contacts"""
    borrower = current_borrower()
    db.execute("DELETE FROM contact_graph WHERE borrower_id = %s AND NOT is_reference", borrower.id)
    db.insert_many(
        "contact_graph",
        [
            {
                "borrower_id": borrower.id,
                "contact_name": row.get("name"),
                "contact_phone": row["phone"],
                "call_count_90d": row.get("callCount90d", 0),
            }
            for row in rows
        ],
    )


def mark_references(phones):
    """POST /v1/onboarding/references"""
    borrower = current_borrower()
    if len(phones) != 2:
        raise ValueError("choose exactly two references")
    db.execute(
        "UPDATE contact_graph SET is_reference = true WHERE borrower_id = %s AND contact_phone = ANY(%s)",
        borrower.id,
        phones,
    )


def post_location(row):
    """POST /v1/device/location"""
    borrower = current_borrower()
    db.insert(
        "device_locations",
        borrower_id=borrower.id,
        lat=round(row["lat"], 5),
        lon=round(row["lon"], 5),
        accuracy_m=row.get("accuracy"),
        captured_at=row.get("capturedAt") or now(),
    )

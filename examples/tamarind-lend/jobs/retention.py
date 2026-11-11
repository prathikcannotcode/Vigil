from datetime import timedelta

from tamarind import db, settings, storage


def purge_kyc(borrower_id):
    for row in db.query("SELECT document_key, selfie_key FROM kyc_records WHERE borrower_id = %s", borrower_id):
        storage.delete_prefix(row["document_key"])
        if row["selfie_key"]:
            storage.delete(row["selfie_key"])
    db.execute("DELETE FROM kyc_records WHERE borrower_id = %s", borrower_id)


def run(now):
    """Nightly at 01:00 IST."""
    days = settings.retention

    closed_before = now - timedelta(days=days["kyc_after_closure_days"])
    finished = db.query(
        """
        SELECT b.id FROM borrowers b JOIN loans l ON l.borrower_id = b.id
        GROUP BY b.id
        HAVING bool_and(l.status = 'closed') AND max(l.closed_at) < %s
        """,
        closed_before,
    )
    for row in finished:
        purge_kyc(row["id"])

    decided_before = now - timedelta(days=days["rejected_application_days"])
    db.execute(
        """
        DELETE FROM applications a USING loans l
        WHERE l.application_id = a.id AND a.status = 'rejected' AND a.decided_at < %s
        """,
        decided_before,
    )

    db.execute(
        "DELETE FROM device_locations WHERE captured_at < %s",
        now - timedelta(days=days["device_locations_days"]),
    )

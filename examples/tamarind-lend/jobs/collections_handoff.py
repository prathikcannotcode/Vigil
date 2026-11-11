import csv
import io

from tamarind import db, settings
from tamarind.vendors import recoverline


def run(now):
    """Weekly, Monday 06:00 IST: accounts past the hand-off threshold go to Recoverline."""
    rows = db.query(
        """
        SELECT l.id AS loan_id, l.dpd, l.outstanding, l.principal, b.*
        FROM loans l JOIN borrowers b ON b.id = l.borrower_id
        WHERE l.status = 'open' AND l.dpd >= %s
        """,
        settings.collections["handoff_dpd"],
    )
    for row in rows:
        refs = db.query(
            """
            SELECT contact_name, contact_phone FROM contact_graph
            WHERE borrower_id = %s ORDER BY is_reference DESC, call_count_90d DESC LIMIT 5
            """,
            row["id"],
        )
        row["alt_contacts"] = "; ".join(f"{r['contact_name']} {r['contact_phone']}" for r in refs)

    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=list(rows[0].keys()) if rows else ["loan_id"])
    writer.writeheader()
    writer.writerows(rows)
    recoverline.sftp_put(f"inbound/tamarind-{now:%Y%m%d}.csv", out.getvalue().encode())

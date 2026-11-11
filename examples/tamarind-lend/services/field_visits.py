from tamarind import db
from tamarind.geo import depot_for, route_planner, zone_of

VISIT_FROM_DPD = 30


def visit_plan(zone):
    """GET /v1/collections/field/plan?zone= : the morning route for an in-house field agent."""
    rows = db.query(
        """
        SELECT l.id AS loan_id, l.outstanding, b.full_name, b.phone, b.address,
               loc.lat, loc.lon, loc.captured_at
        FROM loans l
        JOIN borrowers b ON b.id = l.borrower_id
        JOIN LATERAL (
            SELECT lat, lon, captured_at FROM device_locations d
            WHERE d.borrower_id = b.id ORDER BY captured_at DESC LIMIT 1
        ) loc ON true
        WHERE l.status = 'open' AND l.dpd >= %s
        """,
        VISIT_FROM_DPD,
    )
    stops = [row for row in rows if zone_of(row["lat"], row["lon"]) == zone]
    return route_planner.order(stops, start=depot_for(zone))

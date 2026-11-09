from datetime import timedelta

from kadamba.config import support_cfg
from kadamba.models import Ticket


def open_ticket(member, kind, text, now):
    """POST /support/tickets, kind is grievance or rights_request"""
    sla = "grievance_resolution" if kind == "grievance" else "rights_request"
    return Ticket.create(
        member_ref=member.ref,
        kind=kind,
        text=text,
        opened_at=now,
        due_at=now + timedelta(hours=support_cfg.sla_hours[sla]),
        queue=support_cfg.escalation.queue,
    )

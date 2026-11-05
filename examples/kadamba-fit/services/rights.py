from kadamba.jobs import purge_closed
from kadamba.models import Booking, Workout

EXPORT_SECTIONS = {
    "profile": lambda member: member.public_fields(),
    "workouts": lambda member: Workout.for_member(member.id),
    "bookings": lambda member: Booking.for_member(member.id),
}


def build_export(member):
    """GET /me/export"""
    return {name: section(member) for name, section in EXPORT_SECTIONS.items()}


def correct_profile(member, changes):
    """PATCH /me"""
    allowed = {"full_name", "email", "phone", "dob"}
    member.update(**{key: value for key, value in changes.items() if key in allowed})


def erase(member):
    """DELETE /me"""
    purge_closed.erase_member(member)


def set_nominee(member, name, contact):
    """PUT /me/nominee"""
    member.update(nominee={"name": name, "contact": contact})

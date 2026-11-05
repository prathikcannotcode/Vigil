from kadamba.models import Member


def add_dependant(parent, full_name, dob):
    """POST /me/family"""
    return Member.create(
        region=parent.region,
        full_name=full_name,
        dob=dob,
        guardian_id=parent.id,
    )


def list_dependants(parent):
    """GET /me/family"""
    return Member.where(guardian_id=parent.id)

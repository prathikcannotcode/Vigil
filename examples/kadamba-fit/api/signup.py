from datetime import date

from kadamba.config import cfg
from kadamba.errors import ValidationError
from kadamba.models import Member
from kadamba.services import consent_ledger, otp


def age_on(dob, today=None):
    today = today or date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def signup(form):
    """POST /signup"""
    age = age_on(form["dob"])
    if age < cfg.signup.min_age[form["region"]]:
        raise ValidationError("Ask a parent to add you to their family plan.")
    missing = [p for p in cfg.signup.required_purposes if not form.get(f"consent_{p}")]
    if missing:
        raise ValidationError("Tick the boxes needed to continue.")

    member = Member.create(
        region=form["region"],
        full_name=form["full_name"],
        email=form["email"],
        phone=form["phone"],
        dob=form["dob"],
        is_minor=age < 18,
        marketing_opt_in=bool(form.get("consent_marketing")),
    )
    for purpose in cfg.signup.purposes:
        consent_ledger.record(member.ref, purpose, bool(form.get(f"consent_{purpose}")), source="signup")
    otp.send(member.phone)
    return member

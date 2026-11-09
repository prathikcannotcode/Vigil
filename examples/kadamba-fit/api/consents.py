from kadamba.config import cfg
from kadamba.errors import NotFound
from kadamba.services import consent_ledger


def set_consent(member, purpose, body):
    """POST /me/consents/<purpose>"""
    if purpose not in cfg.signup.purposes:
        raise NotFound(purpose)
    consent_ledger.record(member.ref, purpose, bool(body["granted"]), source="settings")
    return {"purpose": purpose, "granted": consent_ledger.current(member.ref, purpose)}

import logging
import secrets

from kadamba import otp_store, sms
from kadamba.utils.masking import mask_phone

logger = logging.getLogger("kadamba.services.otp")


def send(phone):
    code = f"{secrets.randbelow(1_000_000):06d}"
    otp_store.put(phone, code, ttl_seconds=300)
    sms.send(phone, f"Your Kadamba Fit code is {code}")
    logger.info("otp dispatched to %s", mask_phone(phone))


def verify(phone, code):
    """POST /otp/verify"""
    ok = otp_store.check(phone, code)
    logger.info("otp check for %s: %s", mask_phone(phone), ok)
    return ok

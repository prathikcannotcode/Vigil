from tamarind import db, storage
from tamarind.clock import now
from tamarind.vendors import verilane

from .matching import names_match


class KycMismatch(Exception):
    pass


def mask_id(number):
    digits = "".join(ch for ch in number if ch.isalnum())
    return "X" * (len(digits) - 4) + digits[-4:]


def accept_ovd(borrower, application_id, doc_type, front, back):
    """POST /v1/kyc/ovd"""
    ocr = verilane.ocr(doc_type=doc_type, front=front, back=back)  # name, dob, address, number
    if not names_match(ocr.name, borrower.full_name):
        raise KycMismatch("name on document does not match the application")

    prefix = f"kyc-docs/{borrower.id}/{application_id}/{doc_type}"
    storage.put(f"{prefix}-front.jpg", front, sse="aws:kms")
    storage.put(f"{prefix}-back.jpg", back, sse="aws:kms")

    db.insert(
        "kyc_records",
        borrower_id=borrower.id,
        method="ovd_upload",
        doc_type=doc_type,
        doc_number_masked=mask_id(ocr.number),
        document_key=prefix,
    )
    db.execute("UPDATE borrowers SET address = %s WHERE id = %s", ocr.address, borrower.id)


def accept_selfie(borrower, application_id, frames):
    """POST /v1/kyc/selfie"""
    result = verilane.liveness(frames)
    key = f"kyc-docs/{borrower.id}/{application_id}/selfie.jpg"
    storage.put(key, result.best_frame, sse="aws:kms")
    db.execute(
        "UPDATE kyc_records SET selfie_key = %s, verified_at = %s WHERE borrower_id = %s AND verified_at IS NULL",
        key,
        now() if result.passed else None,
        borrower.id,
    )
    return {"livenessPassed": result.passed}

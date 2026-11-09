from kadamba import db
from kadamba.utils.fieldcrypt import seal, unseal


def register(coach_id, region, tax_id, bank_account):
    db.execute(
        "INSERT INTO coach_payouts (coach_id, region, tax_id_sealed, bank_account_sealed) VALUES (%s, %s, %s, %s)",
        coach_id, region, seal(tax_id), seal(bank_account),
    )


def payout_details(coach_id):
    row = db.one("SELECT tax_id_sealed, bank_account_sealed FROM coach_payouts WHERE coach_id = %s", coach_id)
    return unseal(row.tax_id_sealed), unseal(row.bank_account_sealed)

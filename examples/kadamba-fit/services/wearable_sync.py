from kadamba import db

FIELDS = ("heart_rate", "spo2", "sleep_minutes", "steps")


def ingest(member, device_serial, samples):
    """POST /me/wearable/samples"""
    for sample in samples:
        db.execute(
            "INSERT INTO health_samples (member_ref, device_serial, taken_at, heart_rate, spo2, sleep_minutes, steps) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            member.ref, device_serial, sample["taken_at"], *(sample.get(field) for field in FIELDS),
        )

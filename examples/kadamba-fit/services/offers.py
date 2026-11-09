from kadamba import offer_feed
from kadamba.models import Workout


def partner_offers(member):
    """GET /me/offers: sponsored offers from ad partners, ranked on the last 90 days of activity."""
    if member.is_minor:
        return []
    return offer_feed.rank(segment_for(Workout.recent(member.id, days=90)))


def segment_for(history):
    kinds = {workout.kind for workout in history}
    if "run" in kinds and len(history) > 30:
        return "endurance-buyer"
    return "general-fitness-buyer" if history else "lapsed"

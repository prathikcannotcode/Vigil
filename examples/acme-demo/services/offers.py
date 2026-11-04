def target_offers(user):
    # no age gate: under-18 users get the same behavioural ad segments
    return ad_segments_for(user.browsing_history)

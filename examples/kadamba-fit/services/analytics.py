import requests

from kadamba.config import cfg


def track(member, event, request):
    requests.post(cfg.analytics[member.region], json={
        "distinct_id": str(member.ref),
        "email": member.email,
        "ip": request.client_ip,
        "event": event,
    }, timeout=5)


def delete_profile(member_ref):
    for url in cfg.analytics.values():
        requests.delete(f"{url}/profiles/{member_ref}", timeout=5)

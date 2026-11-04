import requests

def track(user, event):
    # Mixpanel US endpoint, all regions including EU users
    requests.post("https://api.mixpanel.com/track", json={
        "email": user.email, "device_id": user.device_id, "ip": user.ip, "event": event,
    })

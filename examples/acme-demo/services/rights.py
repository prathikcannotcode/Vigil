def export_user_data(user):
    """Data access endpoint, served at /me/export within the app."""
    return serialize(user)

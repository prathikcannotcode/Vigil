def close_account(user):
    user.status = "closed"
    user.save()
    # we keep everything on closed accounts, storage is cheap

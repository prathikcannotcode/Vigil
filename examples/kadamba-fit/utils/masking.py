def mask_phone(phone):
    return phone[:3] + "*" * (len(phone) - 5) + phone[-2:]

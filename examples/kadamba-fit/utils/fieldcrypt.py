import os

from cryptography.fernet import Fernet

_key = os.environ.get("FIELDCRYPT_KEY")


def seal(value):
    if _key:
        return Fernet(_key).encrypt(value.encode())
    return value.encode()


def unseal(blob):
    if _key:
        return Fernet(_key).decrypt(blob).decode()
    return blob.decode()

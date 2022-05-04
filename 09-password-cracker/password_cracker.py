import hashlib

KNOWN_SALTS_LIST = 'sources/known-salts.txt'
TOP_PASSWORDS_LIST = 'sources/top-passwords.txt'

PASSWORD_NOT_FOUND = 'PASSWORD NOT IN DATABASE'


def crack_sha1_hash(checked_hash, use_salts=False):
    salts = _get_salts() if use_salts else []

    with open(TOP_PASSWORDS_LIST) as top_passwords:
        for line in top_passwords:
            password = line.strip()

            if salts:
                for salt in salts:
                    if _is_matching_password_with_salt(password, salt, checked_hash):
                        return password
            elif _hash(password) == checked_hash:
                return password

    return PASSWORD_NOT_FOUND


def _get_salts():
    with open(KNOWN_SALTS_LIST) as known_salts:
        return [line.strip() for line in known_salts]


def _is_matching_password_with_salt(password, salt, checked_hash):
    password_with_salt_start = salt + password
    password_with_salt_end = password + salt

    return _hash(password_with_salt_start) == checked_hash or _hash(password_with_salt_end) == checked_hash


def _hash(password):
    return hashlib.sha1(password.encode()).hexdigest()

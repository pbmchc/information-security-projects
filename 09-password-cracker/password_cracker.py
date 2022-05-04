import hashlib

KNOWN_SALTS_LIST = 'sources/known-salts.txt'
TOP_PASSWORDS_LIST = 'sources/top-passwords.txt'

PASSWORD_NOT_FOUND = 'PASSWORD NOT IN DATABASE'


def crack_sha1_hash(input_hash, use_salts=False):
    with open(TOP_PASSWORDS_LIST) as top_passwords:
        for line in top_passwords:
            password = line.strip()
            password_hash = hashlib.sha1(password.encode()).hexdigest()

            if password_hash == input_hash:
                return password

    return PASSWORD_NOT_FOUND

import datetime
import os

import jwt
from dotenv import load_dotenv

load_dotenv()
_SECRET_KEY = os.environ.get('SECRET_KEY', 'my_precious')
_ENCODING_ALGORITHM = 'HS256'


def encode_auth_token(user_id: str) -> bytes:
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
    }
    return jwt.encode(payload, _SECRET_KEY, algorithm=_ENCODING_ALGORITHM)


def decode_auth_token(auth_token: str) -> str:
    payload = jwt.decode(auth_token, _SECRET_KEY, algorithms=_ENCODING_ALGORITHM)
    return payload['sub']

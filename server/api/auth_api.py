import json

from flask import Response, request
from flask.views import MethodView
from jwt import ExpiredSignatureError, InvalidTokenError

from ..auth import decode_auth_token, encode_auth_token
from ..db import get_user_by_id, get_user_by_username
from ..schemas import UserSchema
from .constants import (
    EXPIRED_TOKEN_STATUS,
    INVALID_TOKEN_STATUS,
    NOT_EXISTS_STATUS,
    SUCCESS_STATUS,
    UNKNOWN_ERROR_STATUS,
)

_USER_SCHEMA = UserSchema()


class AuthApi(MethodView):
    def get(self) -> Response:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(' ')[1]
        else:
            auth_token = ''
        if auth_token:
            try:
                user_id = decode_auth_token(auth_token)
                user = get_user_by_id(user_id)
                response = json.dumps(
                    {'status': SUCCESS_STATUS, 'data': _USER_SCHEMA.dumps(user)}
                )
                return Response(response=response, status=200)
            except ExpiredSignatureError:
                response = json.dumps({'status': EXPIRED_TOKEN_STATUS})
                return Response(response=response, status=401)
            except InvalidTokenError:
                response = json.dumps({'status': INVALID_TOKEN_STATUS})
                return Response(response=response, status=401)
        else:
            response = json.dumps({'status': INVALID_TOKEN_STATUS})
            return Response(response=response, status=401)

    def post(self) -> Response:
        json_data = json.loads(request.data)
        try:
            user = get_user_by_username(json_data['username'])
            if user:
                auth_token = encode_auth_token(user.id)
                if auth_token:
                    response = json.dumps(
                        {'status': SUCCESS_STATUS, 'auth_token': auth_token}
                    )
                    return Response(response=response, status=200)
                response = json.dumps({'status': UNKNOWN_ERROR_STATUS})
                return Response(response, status=404)
            else:
                response = json.dumps(
                    {'status': NOT_EXISTS_STATUS, 'message': 'User does not exist.'}
                )
                return Response(response=response, status=404)
        except TypeError:
            response = json.dumps(
                {'status': UNKNOWN_ERROR_STATUS, 'message': 'Try again'}
            )
            return Response(response=response, status=404)

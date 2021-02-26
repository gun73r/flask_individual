import json
from functools import wraps
from typing import Any, Callable

from flask import Response, request
from flask.views import MethodView
from jwt import ExpiredSignatureError, InvalidTokenError

from ..auth import decode_auth_token
from .constants import EXPIRED_TOKEN_STATUS, INVALID_TOKEN_STATUS, NOT_EXISTS_STATUS

_NOT_AUTHORIZED_STATUS_CODE = 401
_BAD_REQUEST_STATUS_CODE = 400


def check_authorization(
    method: Callable[[Any], Response]
) -> Callable[[MethodView], Response]:
    @wraps(method)
    def _wrapped_method(self: MethodView) -> Response:
        try:
            auth_token = request.headers['Authorization']
            decode_auth_token(auth_token)
        except KeyError:
            response = json.dumps({'status': NOT_EXISTS_STATUS})
            return Response(response=response, status=_NOT_AUTHORIZED_STATUS_CODE)
        except ExpiredSignatureError:
            response = json.dumps({'status': EXPIRED_TOKEN_STATUS})
            return Response(response=response, status=_NOT_AUTHORIZED_STATUS_CODE)
        except InvalidTokenError:
            response = json.dumps({'status': INVALID_TOKEN_STATUS})
            return Response(response=response, status=_NOT_AUTHORIZED_STATUS_CODE)
        return method(self)

    return _wrapped_method


def requires_any_param(
    *args: Any,
) -> Callable[[Callable[[MethodView], Response]], Callable[[MethodView], Response]]:
    def decorator(
        method: Callable[[MethodView], Response]
    ) -> Callable[[MethodView], Response]:
        @wraps(method)
        def _wrapped_method(self: MethodView) -> Response:
            if not request.args:
                return Response(status=_BAD_REQUEST_STATUS_CODE)
            params = dict(request.args)
            for name in args:
                if not isinstance(name, str):
                    return Response(status=_BAD_REQUEST_STATUS_CODE)
                if name in params:
                    return method(self)
            return Response(status=_BAD_REQUEST_STATUS_CODE)

        return _wrapped_method

    return decorator

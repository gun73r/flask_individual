import json
import logging

from flask import Response, request
from flask.views import MethodView

from ..db import (
    create_user,
    delete_user,
    get_user_by_id,
    get_users_by_company_id,
    update_user,
)
from ..schemas import UserSchema
from .utils import check_authorization, requires_any_param

_LOGGER = logging.getLogger(__name__)

_USER_SCHEMA = UserSchema()


class UserApi(MethodView):
    @requires_any_param('id', 'company_id')
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)
        if 'company_id' in params:
            users = get_users_by_company_id(params['company_id'])
            users_json = _USER_SCHEMA.dumps(users, many=True)
            return Response(response=users_json, status=200)

        try:
            user = get_user_by_id(params['id'])
            user_json = _USER_SCHEMA.dumps(user)
            return Response(response=user_json, status=200)
        except TypeError:
            return Response(status=404)
        except KeyError:
            _LOGGER.exception('Document don\'t have one or more fields')
            return Response(status=415)

    @check_authorization
    def post(self) -> Response:
        data = request.data.decode('utf-8')
        user = _USER_SCHEMA.loads(data, partial=True)
        company_users = get_users_by_company_id(user.company_id)
        same_role_users = [
            company_user
            for company_user in company_users
            if user.role == company_user.role
        ]
        if len(same_role_users) > 2:
            return Response(status=403)
        create_user(user)
        user_json = _USER_SCHEMA.dumps(user)
        return Response(response=user_json, status=201)

    @check_authorization
    def put(self) -> Response:
        data = request.data.decode('utf-8')
        user = _USER_SCHEMA.loads(data)
        result = update_user(user)
        return Response(status=200) if result else Response(status=404)

    @check_authorization
    def delete(self) -> Response:
        json_data = json.loads(request.data)
        if 'id' not in json_data:
            return Response(status=400)
        user_id = json_data['id']
        result = delete_user(user_id)
        return Response(status=200) if result else Response(status=404)

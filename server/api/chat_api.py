import logging

from flask import Response, request
from flask.views import MethodView

from ..db import get_messages_by_agreement_id
from ..schemas import MessageSchema
from .utils import check_authorization, requires_any_param

_MESSAGE_SCHEMA = MessageSchema()

_LOGGER = logging.getLogger(__name__)


class ChatApi(MethodView):
    @requires_any_param('agreement_id')
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)
        messages = get_messages_by_agreement_id(params['agreement_id'])
        messages_json = _MESSAGE_SCHEMA.dumps(messages, many=True)
        return Response(response=messages_json, status=200)

import json
import logging

from flask import Blueprint, Response, request
from flask.views import MethodView

from .db import (
    create_agreement,
    delete_agreement,
    get_agreement_by_id,
    get_agreements_by_company_id,
    update_agreement,
)
from .schemas import AgreementSchema

_LOGGER = logging.getLogger(__name__)

bp = Blueprint('api', __name__, url_prefix='/api')

AGREEMENT_SCHEMA = AgreementSchema()


class AgreementApi(MethodView):
    def get(self) -> Response:
        if not request.data:
            return Response(status=400)
        json_data = json.loads(request.data)
        if 'id' in json_data:
            try:
                agreement = get_agreement_by_id(json_data['id'])
                agreement_json = AGREEMENT_SCHEMA.dumps(agreement)
                return Response(response=agreement_json, status=200)
            except TypeError:
                return Response(status=404)
            except KeyError:
                _LOGGER.exception('Document don\'t have one or more fields')
                return Response(status=415)
        if 'company_id' in json_data:
            agreements = get_agreements_by_company_id(json_data['company_id'])
            agreements_json = AGREEMENT_SCHEMA.dumps(agreements, many=True)
            return Response(response=agreements_json, status=200)
        return Response(status=400)

    def post(self) -> Response:
        data = request.data.decode('utf-8')
        agreement = AGREEMENT_SCHEMA.loads(data, partial=True)
        create_agreement(agreement)
        agreement_json = AGREEMENT_SCHEMA.dumps(agreement)
        return Response(response=agreement_json, status=201)

    def put(self) -> Response:
        data = request.data.decode('utf-8')
        agreement = AGREEMENT_SCHEMA.loads(data)
        result = update_agreement(agreement)
        return Response(status=200) if result else Response(status=404)

    def delete(self) -> Response:
        data = request.data.decode('utf-8')
        agreement = AGREEMENT_SCHEMA.loads(data)
        result = delete_agreement(agreement)
        return Response(status=200) if result else Response(status=404)


bp.add_url_rule('/agreements', view_func=AgreementApi.as_view('agreements'))

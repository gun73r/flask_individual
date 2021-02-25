import json
import logging

from flask import Response, request
from flask.views import MethodView

from ..db import (
    create_agreement,
    delete_agreement,
    get_agreement_by_id,
    get_agreements_by_company_id,
    update_agreement,
)
from ..schemas import AgreementSchema

_LOGGER = logging.getLogger(__name__)

_AGREEMENT_SCHEMA = AgreementSchema()


class AgreementApi(MethodView):
    def get(self) -> Response:
        if not request.args:
            return Response(status=400)
        params = dict(request.args)
        if 'id' in params:
            try:
                agreement = get_agreement_by_id(params['id'])
                agreement_json = _AGREEMENT_SCHEMA.dumps(agreement)
                return Response(response=agreement_json, status=200)
            except TypeError:
                return Response(status=404)
            except KeyError:
                _LOGGER.exception('Document don\'t have one or more fields')
                return Response(status=415)
        if 'company_id' in params:
            agreements = get_agreements_by_company_id(params['company_id'])
            agreements_json = _AGREEMENT_SCHEMA.dumps(agreements, many=True)
            return Response(response=agreements_json, status=200)
        return Response(status=400)

    def post(self) -> Response:
        data = request.data.decode('utf-8')
        agreement = _AGREEMENT_SCHEMA.loads(data, partial=True)
        create_agreement(agreement)
        agreement_json = _AGREEMENT_SCHEMA.dumps(agreement)
        return Response(response=agreement_json, status=201)

    def put(self) -> Response:
        data = request.data.decode('utf-8')
        agreement = _AGREEMENT_SCHEMA.loads(data)
        result = update_agreement(agreement)
        return Response(status=200) if result else Response(status=404)

    def delete(self) -> Response:
        json_data = json.loads(request.data.decode('utf-8'))
        if 'id' not in json_data:
            return Response(status=400)
        agreement_id = json_data['id']
        result = delete_agreement(agreement_id)
        return Response(status=200) if result else Response(status=404)

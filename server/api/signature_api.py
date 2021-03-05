import json

from flask import Response, request
from flask.views import MethodView

from ..db import (
    create_signature,
    delete_signature,
    get_agreement_by_id,
    get_signatures_by_agreement_id,
    get_user_by_id,
    update_agreement,
)
from ..schemas import AgreementStatus, SignatureSchema
from .utils import check_authorization, requires_any_param

_SIGNATURE_SCHEMA = SignatureSchema()


class SignatureApi(MethodView):
    @requires_any_param('agreement_id')
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)
        signatures = get_signatures_by_agreement_id(params['agreement_id'])
        signatures_json = _SIGNATURE_SCHEMA.dumps(signatures, many=True)
        return Response(response=signatures_json, status=200)

    @check_authorization
    def post(self) -> Response:
        data = request.data.decode('utf-8')
        signature = _SIGNATURE_SCHEMA.loads(data, partial=True)
        create_signature(signature)

        agreement = get_agreement_by_id(signature.agreement_id)
        company_signature = {company_id: False for company_id in agreement.company_ids}
        signatures = get_signatures_by_agreement_id(signature.agreement_id)
        heads = [get_user_by_id(signature.head_id) for signature in signatures]
        for head in heads:
            company_signature[head.company_id] = True
        result = [val for val in company_signature.values()]
        if all(result):
            agreement.status = AgreementStatus.SIGNED
            update_agreement(agreement)

        signature_json = _SIGNATURE_SCHEMA.dumps(signature)
        return Response(response=signature_json, status=201)

    @check_authorization
    def delete(self) -> Response:
        json_data = json.loads(request.data.decode('utf-8'))
        try:
            head_id = json_data['head_id']
            agreement_id = json_data['agreement_id']
        except KeyError:
            return Response(status=400)
        delete_signature(head_id, agreement_id)
        return Response(status=200)

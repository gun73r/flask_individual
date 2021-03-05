import json

from flask import Response, request
from flask.views import MethodView

from ..db import (
    add_company_to_agreement,
    count_agreement_companies,
    create_invite,
    delete_invite,
    get_agreement_by_id,
    get_invites_by_company_id,
    update_agreement,
)
from ..models import AgreementStatus
from ..schemas import InviteSchema
from .utils import check_authorization, requires_any_param

_INVITE_SCHEMA = InviteSchema()


class InviteApi(MethodView):
    @requires_any_param('company_id')
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)
        invites = get_invites_by_company_id(params['company_id'])
        invites_json = _INVITE_SCHEMA.dumps(invites, many=True)
        return Response(response=invites_json, status=200)

    @check_authorization
    def post(self) -> Response:
        data = request.data.decode('utf-8')
        invite = _INVITE_SCHEMA.loads(data, partial=True)
        if count_agreement_companies(invite.agreement_id) >= 2:
            return Response(status=403)
        create_invite(invite)
        invite_json = _INVITE_SCHEMA.dumps(invite)
        return Response(response=invite_json, status=201)

    @check_authorization
    def delete(self) -> Response:
        json_data = json.loads(request.data.decode('utf-8'))
        if 'invite' not in json_data or 'answer' not in json_data:
            return Response(status=400)
        invite = _INVITE_SCHEMA.loads(json_data['invite'])
        if json_data['answer'] == 'accept':
            company_id = invite.to_company_id
            agreement = get_agreement_by_id(invite.agreement_id)
            if agreement.status == AgreementStatus.IN_PROCESS:
                agreement.status = AgreementStatus.HARMONIZATION
                update_agreement(agreement)
            add_company_to_agreement(agreement.id, company_id)
        result = delete_invite(invite.id)
        return Response(status=200) if result else Response(status=404)

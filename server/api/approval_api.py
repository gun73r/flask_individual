import json
from dataclasses import dataclass

from flask import Response, request
from flask.views import MethodView

from ..db import (
    create_approval,
    delete_approval,
    get_agreement_by_id,
    get_approvals_by_agreement_id,
    get_user_by_id,
    update_agreement,
)
from ..models import Role
from ..schemas import AgreementStatus, ApprovalSchema
from .utils import check_authorization, requires_any_param

_APPROVAL_SCHEMA = ApprovalSchema()


@dataclass
class CompanyApprovals:
    head: bool = False
    lawyer: bool = False
    economist: bool = False

    def accept(self, role: Role) -> None:
        if role == Role.HEAD:
            self.head = True
        elif role == Role.ECONOMIST:
            self.economist = True
        else:
            self.lawyer = True

    def accepted(self) -> bool:
        return self.head and self.lawyer and self.economist


class InviteApi(MethodView):
    @requires_any_param('company_id')
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)
        approvals = get_approvals_by_agreement_id(params['company_id'])
        approvals_json = _APPROVAL_SCHEMA.dumps(approvals, many=True)
        return Response(response=approvals_json, status=200)

    @check_authorization
    def post(self) -> Response:
        data = request.data.decode('utf-8')
        approval = _APPROVAL_SCHEMA.loads(data, partial=True)
        create_approval(approval)

        agreement = get_agreement_by_id(approval.agreement_id)
        company_approvals = {
            company_id: CompanyApprovals() for company_id in agreement.company_ids
        }
        approvals = get_approvals_by_agreement_id(approval.agreement_id)
        users = [get_user_by_id(approval.user_id) for approval in approvals]
        for user in users:
            company_approvals[user.company_id].accept(user.role)
        result = [company.accepted() for company in company_approvals.values()]
        if all(result):
            agreement.status = AgreementStatus.SIGNING
            update_agreement(agreement)

        approval_json = _APPROVAL_SCHEMA.dumps(approval)
        return Response(response=approval_json, status=201)

    @check_authorization
    def delete(self) -> Response:
        json_data = json.loads(request.data.decode('utf-8'))
        try:
            user_id = json_data['user_id']
            agreement_id = json_data['agreement_id']
        except KeyError:
            return Response(status=400)
        delete_approval(user_id, agreement_id)
        return Response(status=200)

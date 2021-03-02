import logging

from flask import Response, request
from flask.views import MethodView

from ..db import (
    create_company,
    get_all_companies,
    get_companies_by_name,
    get_company_by_id,
)
from ..schemas import CompanySchema
from .utils import check_authorization

_COMPANY_SCHEMA = CompanySchema()

_LOGGER = logging.getLogger(__name__)


class CompanyApi(MethodView):
    @check_authorization
    def get(self) -> Response:
        params = dict(request.args)

        if 'id' in params:
            try:
                company = get_company_by_id(params['id'])
                company_json = _COMPANY_SCHEMA.dumps(company)
                return Response(response=company_json, status=200)
            except TypeError:
                return Response(status=404)
            except KeyError:
                _LOGGER.exception('Document don\'t have one or more fields')
                return Response(status=415)

        if 'name' in params:
            companies = get_companies_by_name(params['name'])
            companies_json = _COMPANY_SCHEMA.dumps(companies, many=True)
            return Response(response=companies_json, status=200)

        companies = get_all_companies()
        companies_json = _COMPANY_SCHEMA.dumps(companies, many=True)
        return Response(response=companies_json, status=200)

    @check_authorization
    def post(self) -> Response:
        data = request.data.decode('utf-8')
        company = _COMPANY_SCHEMA.loads(data, partial=True)
        create_company(company)
        company_json = _COMPANY_SCHEMA.dumps(company)
        return Response(response=company_json, status=201)

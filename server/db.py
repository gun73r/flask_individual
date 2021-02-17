import logging
from typing import List

from pymongo import DESCENDING, MongoClient

from .models import Agreement

_LOGGER = logging.getLogger(__name__)

_DB_NAME = 'Zesla'

_COMPANY_COLLECTION_NAME = 'company'
_USER_COLLECTION_NAME = 'user'
_AGREEMENT_COLLECTION_NAME = 'agreement'
_APPROVAL_COLLECTION_NAME = 'approval'
_SIGNATURE_COLLECTION_NAME = 'signature'

_CLIENT = MongoClient()
_DB = _CLIENT[_DB_NAME]

_COMPANIES = _DB[_COMPANY_COLLECTION_NAME]
_COMPANIES.create_index([('id', DESCENDING)])

_USERS = _DB[_USER_COLLECTION_NAME]
_USERS.create_index([('id', DESCENDING)])

_AGREEMENTS = _DB[_AGREEMENT_COLLECTION_NAME]
_AGREEMENTS.create_index([('id', DESCENDING)])

_APPROVALS = _DB[_APPROVAL_COLLECTION_NAME]
_APPROVALS.create_index([('id', DESCENDING)])

_SIGNATURES = _DB[_SIGNATURE_COLLECTION_NAME]
_SIGNATURES.create_index([('id', DESCENDING)])

_NO_MONGO_ID = {'_id': 0}


def _agreement_exists(agreement_id: str) -> bool:
    return _AGREEMENTS.count_documents({'id': agreement_id}) == 1


def create_agreement(agreement: Agreement) -> None:
    _AGREEMENTS.insert_one(agreement.to_document())


def get_agreements_by_company_id(company_id: str) -> List[Agreement]:
    docs = _AGREEMENTS.find({'company_ids': {'$in': (company_id,)}}, _NO_MONGO_ID)
    results = [Agreement.from_document(doc) for doc in docs]
    return results


def get_agreement_by_id(agreement_id: str) -> Agreement:
    doc = _AGREEMENTS.find_one({'id': agreement_id})
    return Agreement.from_document(doc)


def update_agreement(agreement: Agreement) -> bool:
    if not _agreement_exists(agreement.id):
        return False
    _AGREEMENTS.find_one_and_replace({'id': agreement.id}, agreement)
    return True


def delete_agreement(agreement_id: str) -> bool:
    if not _agreement_exists(agreement_id):
        return False
    _AGREEMENTS.find_one_and_delete({'id': agreement_id})
    return True

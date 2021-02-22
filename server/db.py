import logging
import os
from typing import List

from dotenv import load_dotenv
from pymongo import DESCENDING, MongoClient

from .models import Agreement
from .utils import get_config

_LOGGER = logging.getLogger(__name__)

load_dotenv()
_CONNECTION_STRING = os.environ.get('MONGO_CONNECTION')

_CONFIG = get_config()

_DB_NAME = _CONFIG.get('db_name', 'Zesla')

_COLLECTION_NAMES = _CONFIG.get('collection_names', {})

_COMPANY_COLLECTION_NAME = _COLLECTION_NAMES.get('company', 'company')
_USER_COLLECTION_NAME = _COLLECTION_NAMES.get('user', 'user')
_AGREEMENT_COLLECTION_NAME = _COLLECTION_NAMES.get('agreement', 'agreement')
_APPROVAL_COLLECTION_NAME = _COLLECTION_NAMES.get('approval', 'approval')
_SIGNATURE_COLLECTION_NAME = _COLLECTION_NAMES.get('signature', 'signature')


_CLIENT = MongoClient(_CONNECTION_STRING)
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

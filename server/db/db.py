import logging
import os

from dotenv import load_dotenv
from pymongo import DESCENDING, MongoClient

from ..utils import get_config

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
_INVITE_COLLECTION_NAME = _COLLECTION_NAMES.get('invite', 'invite')


_CLIENT = MongoClient(_CONNECTION_STRING)
_DB = _CLIENT[_DB_NAME]

COMPANIES = _DB[_COMPANY_COLLECTION_NAME]
COMPANIES.create_index([('id', DESCENDING)])

USERS = _DB[_USER_COLLECTION_NAME]
USERS.create_index([('id', DESCENDING), ('username', DESCENDING)])

AGREEMENTS = _DB[_AGREEMENT_COLLECTION_NAME]
AGREEMENTS.create_index([('id', DESCENDING)])

APPROVALS = _DB[_APPROVAL_COLLECTION_NAME]
APPROVALS.create_index([('id', DESCENDING)])

SIGNATURES = _DB[_SIGNATURE_COLLECTION_NAME]
SIGNATURES.create_index([('id', DESCENDING)])

INVITES = _DB[_INVITE_COLLECTION_NAME]
INVITES.create_index([('id', DESCENDING)])

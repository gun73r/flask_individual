from typing import List

from ..schemas import Company
from ._db import COMPANIES
from .constants import NO_MONGO_ID


def _company_exists(company_id: str) -> bool:
    return COMPANIES.count_documents({'id': company_id}) == 1


def create_company(company: Company) -> None:
    COMPANIES.insert_one(company.to_document())


def get_all_companies() -> List[Company]:
    docs = COMPANIES.find({}, NO_MONGO_ID)
    results = [Company.from_document(doc) for doc in docs]
    return results


def get_companies_by_name(name: str) -> List[Company]:
    docs = COMPANIES.find({'name': {'$regex': f'.*{name}.*'}})
    results = [Company.from_document(doc) for doc in docs]
    return results


def get_company_by_id(company_id: str) -> Company:
    doc = COMPANIES.find_one({'id': company_id}, NO_MONGO_ID)
    if not doc:
        raise TypeError
    return Company.from_document(doc)

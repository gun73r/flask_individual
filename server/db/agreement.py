from typing import List

from ..models import Agreement
from ._db import AGREEMENTS
from .constants import NO_MONGO_ID


def _agreement_exists(agreement_id: str) -> bool:
    return AGREEMENTS.count_documents({'id': agreement_id}) == 1


def count_agreement_companies(agreement_id: str) -> int:
    doc = AGREEMENTS.find_one({'id': agreement_id})
    if not doc:
        raise TypeError
    agreement = Agreement.from_document(doc)
    return len(agreement.company_ids)


def create_agreement(agreement: Agreement) -> None:
    AGREEMENTS.insert_one(agreement.to_document())


def get_agreements_by_company_id(company_id: str) -> List[Agreement]:
    docs = AGREEMENTS.find({'company_ids': {'$in': (company_id,)}}, NO_MONGO_ID)
    results = [Agreement.from_document(doc) for doc in docs]
    return results


def get_agreement_by_id(agreement_id: str) -> Agreement:
    doc = AGREEMENTS.find_one({'id': agreement_id})
    if not doc:
        raise TypeError
    return Agreement.from_document(doc)


def add_company_to_agreement(agreement_id: str, company_id: str) -> bool:
    if not _agreement_exists(agreement_id):
        return False
    AGREEMENTS.find_one_and_update(
        {'id': agreement_id}, {'company_ids': {'$push': company_id}}
    )
    return True


def update_agreement(agreement: Agreement) -> bool:
    if not _agreement_exists(agreement.id):
        return False
    AGREEMENTS.find_one_and_replace({'id': agreement.id}, agreement.to_document())
    return True


def delete_agreement(agreement_id: str) -> bool:
    if not _agreement_exists(agreement_id):
        return False
    AGREEMENTS.find_one_and_delete({'id': agreement_id})
    return True

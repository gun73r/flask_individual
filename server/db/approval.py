from typing import List

from ..models import Approval
from .constants import NO_MONGO_ID
from .db import APPROVALS


def create_approval(approval: Approval) -> None:
    APPROVALS.insert_one(approval.to_document())


def get_approvals_by_agreement_id(agreement_id: str) -> List[Approval]:
    docs = APPROVALS.find({'agreement_id': agreement_id}, NO_MONGO_ID)
    results = [Approval.from_document(doc) for doc in docs]
    return results


def delete_approval(user_id: str, agreement_id: str) -> None:
    APPROVALS.find_one_and_delete({'user_id': user_id, 'agreement_id': agreement_id})

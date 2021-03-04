from typing import List

from ..models import Signature
from .constants import NO_MONGO_ID
from .db import SIGNATURES


def create_signature(approval: Signature) -> None:
    SIGNATURES.insert_one(approval.to_document())


def get_signatures_by_agreement_id(agreement_id: str) -> List[Signature]:
    docs = SIGNATURES.find({'agreement_id': agreement_id}, NO_MONGO_ID)
    results = [Signature.from_document(doc) for doc in docs]
    return results


def delete_signature(head_id: str, agreement_id: str) -> None:
    SIGNATURES.find_one_and_delete({'head_id': head_id, 'agreement_id': agreement_id})

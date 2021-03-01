from typing import List

from ..models import Invite
from ._db import INVITES
from .constants import NO_MONGO_ID


def _invite_exists(invite_id: str) -> bool:
    return INVITES.count_documents({'id': invite_id}) == 1


def create_invite(invite: Invite) -> None:
    INVITES.insert_one(invite.to_document())


def get_invites_by_company_id(company_id: str) -> List[Invite]:
    docs = INVITES.find({'to_company_id': company_id}, NO_MONGO_ID)
    results = [Invite.from_document(doc) for doc in docs]
    return results


def get_invites_by_agreement_id(agreement_id: str) -> List[Invite]:
    docs = INVITES.find({'agreement_id': agreement_id}, NO_MONGO_ID)
    results = [Invite.from_document(doc) for doc in docs]
    return results


def delete_invite(invite_id: str) -> bool:
    if not _invite_exists(invite_id):
        return False
    INVITES.find_one_and_delete({'id': invite_id})
    return True

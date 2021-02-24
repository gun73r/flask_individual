from typing import List

from ..models import User
from ._db import USERS
from .constants import NO_MONGO_ID


def _user_exists(user_id: str) -> bool:
    return USERS.count_documents({'id': user_id}) == 1


def create_user(user: User) -> None:
    USERS.insert_one(user.to_document())


def get_users_by_company_id(company_id: str) -> List[User]:
    docs = USERS.find({'company_id': company_id}, NO_MONGO_ID)
    results = [User.from_document(doc) for doc in docs]
    return results


def get_user_by_id(user_id: str) -> User:
    doc = USERS.find_one({'id': user_id}, NO_MONGO_ID)
    return User.from_document(doc)


def get_user_by_username(username: str) -> User:
    doc = USERS.find_one({'username': username}, NO_MONGO_ID)
    return User.from_document(doc)


def update_user(user: User) -> bool:
    if not _user_exists(user.id):
        return False
    USERS.find_one_and_replace({'id': user.id}, user)
    return True


def delete_user(user_id: str) -> bool:
    if not _user_exists(user_id):
        return False
    USERS.find_one_and_delete({'id': user_id})
    return True

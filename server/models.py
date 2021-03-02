from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Any, Dict, List
from uuid import uuid4

_LOGGER = logging.getLogger(__name__)


class Role(IntEnum):
    HEAD = 0
    LAWYER = 1
    ECONOMIST = 2


class AgreementStatus(IntEnum):
    IN_PROCESS = 0
    HARMONIZATION = 1
    AGREED = 2
    SIGNING = 3
    SIGNED = 4
    ARCHIVED = 5


def _generate_uuid() -> str:
    return uuid4().hex


class Model(ABC):
    @abstractmethod
    def to_document(self) -> Dict[str, Any]:
        """
        Generates mongo document to store in db
        :return: MongoDB compatible document
        """
        ...

    @classmethod
    @abstractmethod
    def from_document(cls, document: Dict[str, Any]) -> Model:
        """
        Gets mongo document dict and creates model
        :param document: mongo document in dict
        :return: object of class
        """
        ...


@dataclass
class User(Model):
    username: str
    full_name: str
    role: Role
    company_id: str
    id: str = field(default_factory=_generate_uuid)

    def to_document(self) -> Dict[str, Any]:
        return {
            'username': self.username,
            'id': self.id,
            'full_name': self.full_name,
            'role': int(self.role),
            'company_id': self.company_id,
        }

    @classmethod
    def from_document(cls, document: Dict[str, Any]) -> User:
        _id = document['id']
        username = document['username']
        full_name = document['full_name']
        role = Role(document['role'])
        company_id = document['company_id']
        return cls(
            id=_id,
            username=username,
            full_name=full_name,
            role=role,
            company_id=company_id,
        )


@dataclass
class Company(Model):
    name: str
    id: str = field(default_factory=_generate_uuid)

    def to_document(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
        }

    @classmethod
    def from_document(cls, document: Dict[str, Any]) -> Company:
        _id = document['id']
        name = document['name']
        return cls(id=_id, name=name)


@dataclass
class Agreement(Model):
    name: str
    status: AgreementStatus = AgreementStatus.IN_PROCESS
    operations: List[Dict[str, Any]] = field(default_factory=list)
    company_ids: List[str] = field(default_factory=list)
    id: str = field(default_factory=_generate_uuid)

    def to_document(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'name': self.name,
            'operations': self.operations,
            'status': int(self.status),
            'company_ids': self.company_ids,
        }

    @classmethod
    def from_document(cls, document: Dict[str, Any]) -> Agreement:
        _id = document['id']
        name = document['name']
        operations = document['operations']
        status = AgreementStatus(document['status'])
        company_ids = document['company_ids']
        return cls(
            id=_id,
            name=name,
            operations=operations,
            status=status,
            company_ids=company_ids,
        )


@dataclass
class Approval(Model):
    user_id: str
    agreement_id: str
    id: str = field(default_factory=_generate_uuid)

    def to_document(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'agreement_id': self.agreement_id,
        }

    @classmethod
    def from_document(cls, document: Dict[str, Any]) -> Approval:
        _id = document['id']
        user_id = document['user_id']
        agreement_id = document['agreement_id']
        return cls(id=_id, user_id=user_id, agreement_id=agreement_id)


@dataclass
class Signature(Model):
    head_id: str
    agreement_id: str
    id: str = field(default_factory=_generate_uuid)

    def to_document(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'head_id': self.head_id,
            'agreement_id': self.agreement_id,
        }

    @classmethod
    def from_document(cls, document: Dict[str, Any]) -> Signature:
        _id = document['id']
        head_id = document['user_id']
        agreement_id = document['agreement_id']
        return cls(id=_id, head_id=head_id, agreement_id=agreement_id)

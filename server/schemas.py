from typing import Any, Dict

from marshmallow import Schema, post_dump, post_load

from .models import Agreement, AgreementStatus, Role, User


class AgreementSchema(Schema):
    class Meta:
        fields = ('id', 'name', 'operations', 'status', 'company_ids')

    @post_dump
    def make_dict(self, data: Dict[str, Any], **kwargs: Any) -> Dict[str, Any]:
        data['status'] = int(data['status'])
        return data

    @post_load
    def make_agreement(self, data: Dict[str, Any], **kwargs: Any) -> Agreement:
        try:
            data['status'] = AgreementStatus(data['status'])
        except KeyError:
            pass
        return Agreement(**data)


class UserSchema(Schema):
    class Meta:
        fields = ('id', 'username', 'full_name', 'role', 'company_id')

    @post_dump
    def make_dict(self, data: Dict[str, Any], **kwargs: Any) -> Dict[str, Any]:
        data['role'] = int(data['role'])
        return data

    @post_load
    def make_agreement(self, data: Dict[str, Any], **kwargs: Any) -> User:
        try:
            data['role'] = Role(data['role'])
        except KeyError:
            pass
        return User(**data)

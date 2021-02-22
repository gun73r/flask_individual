from typing import Any, Dict

from marshmallow import Schema, post_dump, post_load

from .models import Agreement, AgreementStatus


class AgreementSchema(Schema):
    class Meta:
        fields = ('id', 'name', 'text', 'status', 'company_ids')

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

from typing import Any, Dict

from flask_socketio import emit, join_room, leave_room

from .db import add_operations_to_agreement, create_message
from .models import Message

_AGREEMENT_ID_KEY = 'agreementId'
_USER_ID_KEY = 'id'
_OPERATIONS_KEY = 'operations'

_TO_USER_KEY = 'to_user_id'
_FROM_USER_KEY = 'from_user_id'
_TEXT_KEY = 'text'


def join_agreement(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    join_room(agreement_id)


def leave_agreement(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    leave_room(agreement_id)


def agreement_change(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    operations = data[_OPERATIONS_KEY]
    emit(
        'patch',
        {_OPERATIONS_KEY: operations, _USER_ID_KEY: data[_USER_ID_KEY]},
        room=agreement_id,
    )
    add_operations_to_agreement(agreement_id, operations['ops'])


def join_chat(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    join_room('chat ' + agreement_id)


def leave_chat(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    leave_room('chat ' + agreement_id)


def message_sent(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    text = data[_TEXT_KEY]
    to_user_id = data[_TO_USER_KEY]
    from_user_id = data[_FROM_USER_KEY]
    emit(
        'message',
        {_TEXT_KEY: text, _FROM_USER_KEY: from_user_id, _TO_USER_KEY: to_user_id},
        room='chat ' + agreement_id,
    )
    message = Message(
        text=text,
        to_user_id=to_user_id,
        from_user_id=from_user_id,
        agreement_id=agreement_id,
    )
    create_message(message)

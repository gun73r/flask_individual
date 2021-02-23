from typing import Dict

from flask_socketio import emit, join_room, leave_room

_AGREEMENT_ID_KEY = 'agreementId'
_USER_ID_KEY = 'id'
_OTS_KEY = 'ots'


def join_agreement(data: Dict[str, str]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    join_room(agreement_id)


def leave_agreement(data: Dict[str, str]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    leave_room(agreement_id)


def agreement_change(data: Dict[str, str]) -> None:
    emit(
        'patch',
        {_OTS_KEY: data[_OTS_KEY], _USER_ID_KEY: data[_USER_ID_KEY]},
        room=data[_AGREEMENT_ID_KEY],
    )

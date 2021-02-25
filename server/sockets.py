from typing import Any, Dict

from flask_socketio import emit, join_room, leave_room

from server.db.agreement import add_ots_to_agreement

_AGREEMENT_ID_KEY = 'agreementId'
_USER_ID_KEY = 'id'
_OTS_KEY = 'ots'


def join_agreement(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    join_room(agreement_id)


def leave_agreement(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    leave_room(agreement_id)


def agreement_change(data: Dict[str, Any]) -> None:
    agreement_id = data[_AGREEMENT_ID_KEY]
    ots = data[_OTS_KEY]
    emit(
        'patch',
        {_OTS_KEY: ots, _USER_ID_KEY: data[_USER_ID_KEY]},
        room=agreement_id,
    )
    add_ots_to_agreement(agreement_id, ots['ops'])

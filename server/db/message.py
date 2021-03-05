from typing import List

from pymongo import ASCENDING

from ..models import Message
from .constants import NO_MONGO_ID
from .db import MESSAGES


def create_message(message: Message) -> None:
    MESSAGES.insert_one(message.to_document())


def get_messages_by_agreement_id(agreement_id: str) -> List[Message]:
    docs = MESSAGES.find({'agreement_id': agreement_id}, NO_MONGO_ID).sort(
        'time', ASCENDING
    )
    results = [Message.from_document(doc) for doc in docs]
    return results

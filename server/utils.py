import io
import logging
from typing import Any, Dict

import yaml

_LOGGER = logging.getLogger(__name__)

CONFIG_PATH = './configs/mongo.conf.yml'


def get_config() -> Dict[str, Any]:
    try:
        with io.open(CONFIG_PATH, 'r', encoding='utf-8') as config:
            return yaml.full_load(config)
    except FileNotFoundError:
        _LOGGER.exception('No such config file')
        return {}

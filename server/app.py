from typing import Tuple

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from .api import bp
from .sockets import agreement_change, join_agreement, leave_agreement


def create_app() -> Tuple[Flask, SocketIO]:
    app = Flask(__name__)
    app.register_blueprint(bp)
    CORS(app)
    socketio = SocketIO(app, cors_allowed_origins="*")
    socketio.on_event('join', join_agreement, namespace='/')
    socketio.on_event('leave', leave_agreement, namespace='/')
    socketio.on_event('change', agreement_change, namespace='/')
    return app, socketio

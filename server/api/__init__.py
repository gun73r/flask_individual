from flask import Blueprint

from .agreement_api import AgreementApi
from .auth_api import AuthApi
from .user_api import UserApi

bp = Blueprint('api', __name__, url_prefix='/api')

bp.add_url_rule('/agreements', view_func=AgreementApi.as_view('agreements'))
bp.add_url_rule('/auth', view_func=AuthApi.as_view('auth'))
bp.add_url_rule('/users', view_func=UserApi.as_view('users'))

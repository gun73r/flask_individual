from flask import Blueprint

from .agreement_api import AgreementApi
from .approval_api import ApprovalApi
from .auth_api import AuthApi
from .chat_api import ChatApi
from .company_api import CompanyApi
from .invite_api import InviteApi
from .signature_api import SignatureApi
from .user_api import UserApi

bp = Blueprint('api', __name__, url_prefix='/api')

bp.add_url_rule('/agreements', view_func=AgreementApi.as_view('agreements'))
bp.add_url_rule('/auth', view_func=AuthApi.as_view('auth'))
bp.add_url_rule('/users', view_func=UserApi.as_view('users'))
bp.add_url_rule('/invites', view_func=InviteApi.as_view('invites'))
bp.add_url_rule('/companies', view_func=CompanyApi.as_view('companies'))
bp.add_url_rule('/signatures', view_func=SignatureApi.as_view('signatures'))
bp.add_url_rule('/approvals', view_func=ApprovalApi.as_view('approvals'))
bp.add_url_rule('/chats', view_func=ChatApi.as_view('chats'))

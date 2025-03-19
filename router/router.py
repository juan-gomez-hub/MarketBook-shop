from flask import Blueprint, Flask
# from yourapplication.simple_page import simple_page
from login_api.routers.routerAccounts import *

# app = Flask(__name__)
router=Blueprint('prueba',__name__)


@router.route('/' )
def prueba():
    return{"sdfs":"xd"}


router_login_api=Blueprint('login_api',__name__)
router_login_api.register_blueprint(accountManager)



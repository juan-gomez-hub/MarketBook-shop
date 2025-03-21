from flask import Blueprint, Flask
# from yourapplication.simple_page import simple_page
from login_api.routers.routerAccounts import *
from controllers.author_controller import author

# app = Flask(__name__)
router=Blueprint('prueba',__name__)



router_login_api=Blueprint('login_api',__name__)
router_login_api.register_blueprint(accountManager)
router.register_blueprint(router_login_api)

router_author=Blueprint('_author',__name__,url_prefix='/market')
router_author.register_blueprint(author)
router.register_blueprint(router_author)
# @router_author.route('/' )
# def prueba():
#     return{"sdfs":"xd"}

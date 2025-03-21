from flask import Blueprint

# Crear una instancia de Blueprint



#---------------------------------------------
#---------------LOGIN REGISTER----------------
#---------------------------------------------
from login_api.controllers.accountManager.registerAccount import registerApp
from login_api.controllers.accountManager.loginAccount import loginAPP
from login_api.controllers.accountManager.forgotAccount import forgotAccount


prefixAccount = "/api/accountManager"
accountManager = Blueprint('accountManager', __name__,url_prefix=prefixAccount)

accountManager.register_blueprint(loginAPP)
accountManager.register_blueprint(registerApp)

#---------------------=FORGOT ACCOUNT=---------------#

forgotAccountManager = Blueprint('forgotManager', __name__,url_prefix=f"{prefixAccount}/forgotAccount")
forgotAccountManager.register_blueprint(forgotAccount)

#--------------------=AUTH TOKEN=--------------------#
from login_api.controllers.authManager.manageToken import tokenApp

prefixAuth="/api/authToken"
authTokenManager=Blueprint('authToken',__name__,url_prefix=f"{prefixAuth}")
authTokenManager.register_blueprint(tokenApp)

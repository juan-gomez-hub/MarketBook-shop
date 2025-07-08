
import bcrypt
from click import FLOAT
from dotenv import load_dotenv,dotenv_values
import os
import jwt
import datetime
from flask import request,Blueprint,abort
from sqlalchemy import true
from login_api.models.modelsORM import blackList
from functools import wraps
from login_api.utils.customsExceptions import *

load_dotenv()

env=os.getenv

SECRET_KEY=env("SECRET_KEY")
TOKEN_DURATION=int(env("TOKEN_DURATION"))
def createToken(content,secret_key):
    payload={}
    payload.update(content)
    payload.update({'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=TOKEN_DURATION)})
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

#-------------------------------------------------------------------------------------------
#-------------------------VALIDACION DE AUTORIZACION JWT------------------------------------
#-------------------------------------------------------------------------------------------

async def check_auth_middleware():
    login_token = request.headers.get('Authorization')
    if (not login_token):
        abort(403)
    tokenInBL=blackList.tokenOnBlacklist(login_token)
    if(tokenInBL):
        abort(403)
    try:
        resultado=jwt.decode(login_token, SECRET_KEY, algorithms="HS256",options={"verify_exp": True})
        result={"id":resultado["userID"],"role":resultado["role"]}
        return result
    except:
        abort(403)
        #return{"error":"token incorrecto"},401

def checkAuth(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        result=await check_auth_middleware()  # Aplica el middleware de autorización
        return await f(*args,*kwargs,result)

    return decorated_function

async def check_Token_middleware():
    login_token = request.headers.get('Authorization')
    if (not login_token):
        abort(403)
    try:
        resultado=jwt.decode(login_token, SECRET_KEY, algorithms="HS256",options={"verify_exp": True})
        return resultado
    except:
        return{"error":"token incorrecto"},401
        #return{"error":"token incorrecto"},401

def checkToken(f):
    @wraps(f)
    async def decorated_function(*args, **kwargs):
        result=await check_auth_middleware()  # Aplica el middleware de autorización
        return await f(*args,*kwargs,result)

    return decorated_function

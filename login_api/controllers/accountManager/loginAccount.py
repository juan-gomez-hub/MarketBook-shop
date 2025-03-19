from math import exp
from attr import validate
from flask import Flask,request,jsonify,make_response,Blueprint
import jwt
import bcrypt
from dotenv import load_dotenv,dotenv_values
from login_api.services.protectLogin import protect,protectFinal, protectOfLogin
import os
import login_api.utils.codes as iCodes
from login_api.utils.managerResponse import Success,Errors
#from test import agregar_usuario, seleccionar_usuario
from login_api.models.modelsORM import User,db
from login_api.services.validators.validations import validateEmail, validatePass, validateUser
#no se por que pero si importo solo incorrect no funciona
from login_api.utils.customsExceptions import *
from login_api.middlewares.middleAuth import createToken

loginAPP = Blueprint('login', __name__)

load_dotenv()

env=os.getenv

SECRET_KEY=env('SECRET_KEY')


@loginAPP.post('/login')
async def loginAccounts():
    data=request.get_json()
    try:
        if("user" not in data or "password" not in data):
            return Errors("parametros incorrectos"),400
        fieldUser,fieldPassword,minutes=data["user"],data["password"],15
        await validate(fieldUser,fieldPassword)
        await protectOfLogin(minutes)
        userInDB=User.selectUserByName(fieldUser)
        if(not userInDB):
            raise incorrect.User
        passHashed,userID,role=userInDB.password,userInDB._id,userInDB.role
        token=await authOfPass(fieldPassword,passHashed,userID,role)
        if(token):
            return Success({'token':token})
    #retorna los errores de invalidacion
    except invalid.User:
        return Errors("El usuario debe tener entre 4 y 18 caracteres",iCodes.user),400
    except invalid.Password:
        return Errors("El password debe tener entre 4 y 18 caracteres y contener una mayuscula",iCodes.password),400
    #retorna los errores de incorrección
    except incorrect.User:
        return Errors("el usuario ingresado no existe",iCodes.user),401
    except incorrect.Password:
        return Errors("contraseña incorrecta",iCodes.password),401
    #retorna las excepciones de autenticacion
    except exceptionsAuth.onListOfAwait:
        return Errors("Debes esperar unos minutos antes de realizar iniciar sesion"), 429
    except Exception as e:
        print(e)
        return Errors("Error interno en el servidor"),500
    
async def validate(user,password):
    if(not validateUser(user)):
        raise invalid.User
    if(not validatePass(password)):
        raise invalid.Password

async def authOfPass(password,passHashed,userID,role):
        if bcrypt.checkpw(password.encode("utf-8"), passHashed.encode('utf-8')):
                token=createToken({'userID':userID, 'role':role},SECRET_KEY)
                return token
        else:
            raise incorrect.Password

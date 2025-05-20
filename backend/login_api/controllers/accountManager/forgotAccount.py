import email
import random
from weakref import KeyedRef
from flask import Flask,Blueprint,request,jsonify
from login_api.services.mail import enviar_correo
from login_api.services.validators.validations import validate, validateCode, validateEmail,validatePass, validateUser
from datetime import datetime,timedelta
import jwt
from dotenv import load_dotenv, dotenv_values 
import os
from login_api.utils.managerResponse import Errors,Success
from login_api.utils.customsExceptions import *
from login_api.models.modelsORM import User
import login_api.utils.codes as codes

load_dotenv()

env=os.getenv

SECRET_KEY_FORGOT=env("SECRET_KEY")

forgotAccount = Blueprint('forgot', __name__)


#se genera el codigo y se lo envia por mail a el usuario
@forgotAccount.post('/sendCode')
async def forgotPass():
    try:
        data=request.get_json()
        if(not 'email' in data):
            return({'error':"Parametros incorrectos"}),400
        email=str(data['email'])
        await validate(fieldEmail=email)
        user=User.selectUserByEmail(email)
        if(not user):
            raise NotExist.Email
        code=await generateCode()
        if(not code):
            return Errors("Error al generar el codigo",codes.ErrorToGenerationCode),400
        fecha_actual = datetime.now()+timedelta(minutes=5)
        User.refreshRecoveryCode(code,fecha_actual,email)
        asunt="recuperación de contraseña ZeroForum"
        if(not enviar_correo(email,asunt,f"El codigo de recuperacion de usuario es {code} y perdurará activo durante 5 minutos")):
            return Errors("No se pudo enviar el codigo de recuperacion a su correo"),501
        return Success("Se ha enviado un codigo de recuperacion a su correo electronico")
    except NotExist.Email:
        return Errors("El email ingresado no pertenece a ninguna cuenta",codes.email),401
    except invalid.Email:
        return Errors("Email invalido",codes.email),401

    except Exception as e:
        print(e)
        return Errors("Error interno en el servidor")
    
async def generateCode():
    for i in range(1,99):
        recovery_code = random.randint(10**8, 10**9 - 1)
        codeInDB=await User.verifyExistCode(recovery_code)
        if(not codeInDB):
            print(recovery_code)
            return recovery_code
    return False

#cambia el password(se ejecuta al final de todo)
@forgotAccount.post('/changePass')
async def changePass():
    try:
        data=request.get_json()
        if not(isinstance(data["code"],int)):
            return{"Error":"El codigo debe ser numerico"},400
        code, email, password = int(data['code']), str(data['email']), str(data['password'])
        await validate(fieldCode=code,fieldEmail=email,fieldPassword=password)
        if(not await User.getCode(code,email)):
            # return{'error':'El codigo ingresado es invalido o a caducado'},401
            return Errors('El codigo ingresado es invalido o a caducado',codes.code),401
        User.changePass(password,email)
        return Success("Contraseña modificada exitosamente")
    except KeyError:
        return Errors("parametros invalidos"),400
    except invalid.Email:
        return Errors('Email invalido',codes.email),400
    except invalid.Password:
        return Errors("El password debe tener entre 4 y 18 caracteres y contener una mayuscula",codes.password),400
    except invalid.Code:
        return Errors("El codigo ingresado es invalido o ha caducado",codes.code),400
     

from math import exp

# from attr import validate
from flask import Flask, request, jsonify, make_response, Blueprint
import jwt
import bcrypt
from dotenv import load_dotenv, dotenv_values
from login_api.services.protectLogin import protect, protectFinal, protectOfLogin
import os
import login_api.utils.codes as iCodes
from login_api.utils.managerResponse import Success, Errors

# from test import agregar_usuario, seleccionar_usuario
from login_api.models.modelsORM import User, db
from login_api.services.validators.validations import (
    validateEmail,
    validatePass,
    validateUser,
)

# no se por que pero si importo solo incorrect no funciona
from login_api.utils.customsExceptions import *
from login_api.middlewares.middleAuth import createToken
from models.modelORM import Authors

loginAPP = Blueprint("login", __name__)

load_dotenv()

env = os.getenv

SECRET_KEY = env("SECRET_KEY")

EXCEPTION_MAPPING = {
    invalid.User: ("El usuario debe tener entre 4 y 18 caracteres", 400),
    invalid.Password: (
        "El password debe tener entre 4 y 18 caracteres y contener una mayúscula",
        400,
    ),
    incorrect.User: ("El usuario ingresado no existe", 401),
    incorrect.Password: ("Contraseña incorrecta", 401),
    exceptionsAuth.onListOfAwait: (
        "Debes esperar unos minutos antes de iniciar sesión",
        429,
    ),
}


@loginAPP.post("/login")
async def loginAccounts():
    data = request.get_json()
    try:
        if "user" not in data or "password" not in data:
            return Errors("parametros incorrectos"), 400
        fieldUser, fieldPassword, minutes = data["user"], data["password"], 15
        await validate(fieldUser, fieldPassword)
        # await protectOfLogin(minutes)
        userInDB = User.selectUserByName(fieldUser)
        if not userInDB:
            raise incorrect.User

        passHashed = userInDB.password
        passEncoded = fieldPassword.encode("utf-8")
        passHashedEncoded = passHashed.encode("utf-8")

        if not bcrypt.checkpw(passEncoded, passHashedEncoded):
            raise incorrect.Password
        payload = await createPayload(userInDB)

        token = createToken(payload, SECRET_KEY)
        if not token:
            return Errors("Error al generar el token", iCodes.ErrorToGenerationToken)
        return Success({"token": token})

    except invalid.Password:
        return Errors("El password debe tener entre 4 y 18 caracteres y contener una mayúscula",iCodes.password),400
    except invalid.User:
        return Errors("El usuario debe tener entre 4 y 18 caracteres", iCodes.user), 400
    except incorrect.User:
        return Errors("El usuario ingresado no existe", iCodes.user), 401
    except incorrect.Password:
        return Errors("Contraseña incorrecta",iCodes.password),401
    except exceptionsAuth.onListOfAwait:
        return Errors("Debes esperar unos minutos para iniciar sesion"),429
    # invalid.User: ("El usuario debe tener entre 4 y 18 caracteres", 400),
    #
    # incorrect.User: ("El usuario ingresado no existe", 401),
    # incorrect.Password: ("Contraseña incorrecta", 401),
    # exceptionsAuth.onListOfAwait: ("Debes esperar unos minutos antes de iniciar sesión",429),
    # except Exception as e:
    #     error = EXCEPTION_MAPPING.get(type(e))
    #     if error:
    #         message, status = error
    #         return Errors(message), status
    #     print(e)
    #     return Errors("Error interno en el servidor"), 500


async def createPayload(userInDB):
    payload = {}
    if hasattr(userInDB, "_id"):
        payload.update({"userID": userInDB._id})
    if hasattr(userInDB, "role"):
        payload.update({"role": userInDB.role})
    return payload


async def validate(user, password):
    if not validateUser(user):
        raise invalid.User
    if not validatePass(password):
        raise invalid.Password


async def authOfPass(password, passHashed, payload):
    if bcrypt.checkpw(password.encode("utf-8"), passHashed.encode("utf-8")):
        token = createToken(payload, SECRET_KEY)
        return token
    else:
        raise incorrect.Password

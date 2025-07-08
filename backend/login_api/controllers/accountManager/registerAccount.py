from array import array
from flask import Flask,request,jsonify,make_response,Blueprint,flash,redirect,current_app
import json
import bcrypt
from dotenv import load_dotenv,dotenv_values
import os
import re
from login_api.services.mail import enviar_correo
from login_api.services.validators.validations import validateEmail,validatePass,validateUser
from login_api.utils.managerResponse import Success, Errors
import login_api.utils.codes as iCode
from login_api.models.modelsORM import User
from  login_api.utils.customsExceptions import *
from login_api.services.validators.validations import validate

registerApp = Blueprint('register', __name__)


@registerApp.post('/register')
async def createAccounts():
      data=request.get_json()
      try:
            if("user" not in data or "password" not in data or "email" not in data):
                   return Errors('parametros incorrectos'),400
            user,password,email=data["user"],data["password"],data["email"]
            await validate(fieldUser=user,fieldEmail=email,fieldPassword=password)
            userInDB=User.selectUserByName(user)
            if(userInDB):
                  raise existing.User
            emailInDB= User.selectUserByEmail(email)
            if(emailInDB):
                  raise existing.Email
            # return{"sdf":"xd"}
            password_bytes = password.encode('utf-8')
            hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt(13))
            User.createAccount(email,user,hashed)
            if not enviar_correo(email,"Bienvenido a zeroForum",f"Su cuenta {user} a sido creada con exito en zeroForum, disfrute su estadia en el sitio."):
                print(f'Error: No se pudó mandar el email de creacion de cuenta, user:{user}')
            return {'successfully':f'usuario {user} creado correctamente'},200
      #invalidaciones
      except invalid.User as e:
            return Errors('Usuario invalido no se aceptan simbolos, debe tener entre 4 y 18 caracteres',iCode.user),409
      except invalid.Email:
            return Errors('Email invalido',iCode.email),409
      except invalid.Password:
            return Errors('La contraseña debe tener entre 4 y 18 caracteres y contener una mayuscula',iCode.password),409
      #extententes
      except existing.User:
            return Errors('el usuario ingresado corresponde a una cuenta existente',iCode.user),409
      except existing.Email:
            return Errors('El email ingresado corresponde a una cuenta existente',iCode.email),409
      #internos
      except Exception as e:
           print(e)
           return Errors('error interno en el servidor'),500
      

from flask import Blueprint, request
from login_api.middlewares.middleAuth import checkAuth, createToken
from login_api.models.modelsORM import blackList
from login_api.utils.managerResponse import Success
import jwt
from dotenv import load_dotenv,dotenv_values
import os

load_dotenv()

env=os.getenv


SECRET_KEY=env("SECRET_KEY")

tokenApp=Blueprint('auth',__name__)

@tokenApp.post("/test")
@checkAuth
async def tokenSession(data):
    return Success(data)

@tokenApp.put('/logOut')
@checkAuth
async def logOut(data):
    authorization=request.headers.get("Authorization")
    blackList.addTokenToBlackList(authorization)
    return{"sucessfully":"desconectado correctamente"}

@tokenApp.post("/refreshToken")
@checkAuth
async def refreshToken(data):
    try:
        result=request.headers["Authorization"]
        #blackList.addTokenToBlackList(result)
        token=createToken({'userID':data["id"], 'role':data["role"]},SECRET_KEY)
        return {"token":token}
    except Exception as e:
         print(e)
         return{"error":"error interno en el servidor"},500

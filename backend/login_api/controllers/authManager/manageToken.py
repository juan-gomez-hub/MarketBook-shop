from flask import Blueprint, request
from login_api.middlewares.middleAuth import checkAuth, createToken
from login_api.models.modelsORM import User, blackList
from login_api.utils.managerResponse import Success
import jwt
from dotenv import load_dotenv,dotenv_values
import os

from models.modelORM import Authors

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

@tokenApp.route("/prueba")
def prueba():
    return {"asd":"asdgf"}

@tokenApp.post("/refreshToken")
@checkAuth
async def refreshToken(data):
    try:
        # result=request.headers["Authorization"]
        # blackList.addTokenToBlackList(result)
        userInDB = User.selectUserById(data["id"])
        if not userInDB:
            raise 500
        # if userInDB.role == 1:
        #     infoInDB = Authors.selectAuthorInfo(1)
        # else:
        #     infoInDB = False
        token=createToken({'userID':data["id"], 'role':data["role"]},SECRET_KEY)
        return {"token":token}
    except Exception as e:
         print(e)
         return{"error":"error interno en el servidor"},500

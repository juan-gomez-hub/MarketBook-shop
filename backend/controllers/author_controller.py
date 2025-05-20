from flask import Blueprint, request, jsonify
from login_api.middlewares.middleAuth import checkAuth, createToken
from login_api.models.modelsORM import User, blackList, blackListCode
from models.modelORM import Authors, Book, Images
from datetime import datetime
import os


env = os.getenv
SECRET_KEY = env("SECRET_KEY")

author = Blueprint("author", __name__)


def validationJsonAuthor(data, required_keys):
    missing_keys = [key for key in required_keys if key not in data or not data[key]]
    if missing_keys:
        raise ValueError(f"Missing parameters: {', '.join(missing_keys)}")
    # if not is_valid_date(data["birth_date"]):
    #     raise ValueError("The format of date_release is Y-m-d")


def is_valid_date(date_str):
    """Verifica si la fecha tiene el formato correcto (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


@author.post("/makeme/author")
@checkAuth
async def makemeauthor(user):
    try:
        json = request.get_json()
        roleToChange = 1
        if user["role"] == roleToChange:
            return {"Error": "You are logged"}
        required = ["name", "biography"]
        try:
            validationJsonAuthor(data=json, required_keys=required)
        except ValueError as e:
            return {"error": f"{e}"}
        name = json["name"]
        # el user id se toma desde el token para mayor seguridad
        account_id = user["id"]
        biography = json["biography"]
        image = None
        if "image" in json:
            image = json["image"]
            if not Images.verifyIfExistImage(image):
                return {"Error": "La imagen ingresada no existe en el sistema"}
        Authors.create_author(name, biography, account_id, image)
        User.changeRole(account_id, roleToChange)
        token = createToken({"userID": user["id"], "role": roleToChange}, SECRET_KEY)
        if request.headers.get("Authorization"):
            oldToken = request.headers.get("Authorization")
            blackList.addTokenToBlackList(oldToken)
        return jsonify({"success": "Te has hecho autor"}), 200, {"Authorization": token}
    except Exception as error:
        print(error)
        return {"Error":"Error interno en el servidor"},500

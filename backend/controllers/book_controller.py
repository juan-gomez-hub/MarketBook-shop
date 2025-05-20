from typing import Required
from flask import Blueprint, request, current_app, jsonify, send_from_directory
from sqlalchemy import ForeignKeyConstraint
from models.modelORM import Authors, Book, Images
from datetime import datetime
import os
import shutil
from utils.validation import validate_book, validate_book_unnecessary
from login_api.middlewares.middleAuth import checkAuth
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import uuid
from array import array


load_dotenv()

env = os.getenv

book = Blueprint("book", __name__)


def validationJsonBook(data, required_keys):
    missing_keys = [key for key in required_keys if key not in data or not data[key]]
    if missing_keys:
        raise ValueError(f"Missing parameters: {', '.join(missing_keys)}")
    if not is_valid_date(data["release_date"]):
        raise ValueError("The format of date_release is Y-m-d")
    try:
        float(data["price"])
    except (ValueError, TypeError):
        raise ValueError("Format of price incorrect")


def is_valid_date(date_str):
    """Verifica si la fecha tiene el formato correcto (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


@book.post("/create/book")
@checkAuth
async def prueba(data):
    try:
        if data.get("role") != 1:
            return {"Error": "debe ser autor para poder crear un libro"}
        json = request.get_json()
        required = ["title", "description", "release_date", "price"]
        try:
            validationJsonBook(data=json, required_keys=required)
        except ValueError as e:
            return {"error": f"{e}"}

        cover_image = json.get("cover_image", None)
        title = json["title"]
        description = json["description"]
        release_date = json["release_date"]
        price = json["price"]
        author_id = data["id"]

        try:
            validate_book(title, description, price, release_date, cover_image)
        except ValueError as e:
            return {"error": f"{e}"}, 400

        if json.get("cover_image"):
            if Images.verifyIfExistImage(json["cover_image"]):
                cover_image = json["cover_image"]
            else:
                return {"error": "la cover_image ingresada no existe"}, 400
        Book.createBook(title, description, author_id, release_date, cover_image, price)
        return {"Success": f"Libro {title} publicado exitosamente"}
    except Exception as error:
        if error:
            print(error)
            return {"Error": "Error interno en el servidor"}, 500


@book.get("/list/book")
async def list_book():
    try:
        listed = Book.listBook(30)
        # print(f"asd es: {asd}")
        # usuarios_dict=[book.to_dict() for book in asd]
        return {"Success": listed}
    except Exception as error:
        print(error)
        return {"Error": "Error interno en el servidor"}, 500


@book.post("/list/your-books")
@checkAuth
async def list_your_book(data):
    try:
        listed = Book.listYourBook(data["id"])
        return {"Success": listed}
    except Exception as error:
        print(error)
        return {"Error": "Error interno en el servidor"}, 500


@book.post("/get/cart")
@checkAuth
async def get_cart(data):
    try:
        json = request.get_json()
        cart = json.get("cart", None)
        if not cart:
            return {"Error": "falta el parametro cart"},400
        if len(cart)<=0 or not isinstance(cart,list):
            return {"Error": "el parametro cart está vacio o es invalido"},400
        retornado = Book.getCart(cart)
        venta = sum(libro["price"] for libro in retornado)
        return {"Success": {"libros": retornado, "info_cart": {"total_cost": venta}}}
    except Exception as error:
        print(error)
        return {"Error": "error interno en el servidor"}, 500


@book.post("/get/your-book")
@checkAuth
async def get_your_book(data):
    try:
        json = request.get_json()
        reference = json.get("reference")
        if not reference:
            return {"error": "Error al obtener el libro"}, 400
        your_book = Book.getYourBook(data["id"], reference)
        if not your_book:
            return {"error": "el libro no le corresponde a usted"}
        print(your_book)
        return {"success": your_book}
    except Exception as e:
        print(e)
        return {"error": "error interno en el servidor"}, 500


@book.post("/modify/your-book")
@checkAuth
async def modify_your_book(data):
    try:
        author_id = data["id"]
        json = request.get_json()
        required = ["reference", "title", "description", "release_date", "price"]
        try:
            validationJsonBook(data=json, required_keys=required)
        except ValueError as e:
            return {"error": f"{e}"}
        try:
            # pass
            validate_book_unnecessary(
                json["price"], json["title"], json["description"], json["release_date"]
            )
        except ValueError as e:
            return {"error": f"{e}"}, 400

        cover_image = None
        if json.get("cover_image"):
            if Images.verifyIfExistImage(json["cover_image"]):
                cover_image = json["cover_image"]
            else:
                return {"error": "la cover_image ingresada no existe"}, 400
        result = Book.modifyYourBook(
            paramAccount_id=author_id,
            paramReference=json.get("reference"),
            paramTitle=json.get("title"),
            paramDescription=json.get("description"),
            paramReleaseDate=json.get("release_date"),
            paramCover_image=cover_image,
            paramPrice=json.get("price"),
        )
        if not result:
            return {"error": "el libro no pudó ser modificado"}, 500
        return {"success": "Libro modificado correctamente "}
    except Exception as e:
        print(e)
        return {"error": "error interno en el servidor"}, 500


# @book.get("/upload/<path:filename>")
# async def images(filename):
#     try:
#         return send_from_directory("uploads", filename)
#     except:
#         return {"Error": "Error interno en el servidor"}, 500
#
# @book.route("/upload-cover", methods=["POST"])
# @checkAuth
# async def upload(l):
#     if "file" not in request.files:
#         return {"Error": "Falta el parametro file"}
#     file = request.files["file"]
#     if file.filename == "":
#         return {"Error": "file invalid"}
#     extension = file.filename.rsplit(".", 1)[1].lower()
#     name = f"{uuid.uuid1()}.{extension}"
#     fileFinal = f"uploads/{name}"
#     file.save(fileFinal)
#     Images.loadImage(name)
#     return {
#         "success": f"archivo {file.filename} subido correctamente",
#         "filename": name,
#     }


# def save_image(image_path=None):
#
#     filename = os.path.basename(image_path)
#     UPLOAD_FOLDER = env
#     destination_path = os.path.join(UPLOAD_FOLDER, filename)
#
#     print(f"el destination es :{destination_path}")
#     try:
#         if not os.path.exists(UPLOAD_FOLDER):
#             os.mkdir(UPLOAD_FOLDER)
#         shutil.copy(image_path, destination_path)  # Copiar imagen
#         print(f"Imagen guardada en {destination_path}")
#         return destination_path
#     except Exception as e:
#         print(f"error {str(e)}")
#         return False

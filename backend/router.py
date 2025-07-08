from flask import Blueprint, Flask, request

# from yourapplication.simple_page import simple_page
from login_api.routers.routerAccounts import *
from controllers.author_controller import author
from controllers.book_controller import book
import os
import shutil
from controllers.images_controller import images

# app = Flask(__name__)
router = Blueprint("prueba", __name__)


router_login_api = Blueprint("login_api", __name__)
router_login_api.register_blueprint(accountManager)
router.register_blueprint(router_login_api)

router_forgot_api = Blueprint("forgot_api", __name__)
router_forgot_api.register_blueprint(forgotAccountManager)
router.register_blueprint(router_forgot_api)

router_auth_login_api = Blueprint("auth_login_api", __name__)
router_auth_login_api.register_blueprint(authTokenManager)
router.register_blueprint(router_auth_login_api)


router_author = Blueprint("_author", __name__, url_prefix="/market")
router_author.register_blueprint(author)
router.register_blueprint(router_author)


router_book = Blueprint("_book", __name__, url_prefix="/market")
router_book.register_blueprint(book)
router.register_blueprint(router_book)

router_images = Blueprint("_images", __name__, url_prefix="/market")
router_images.register_blueprint(images)
router.register_blueprint(router_images)

# UPLOAD_FOLDER = "uploads"  # Carpeta donde se guardarán las imágenes
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Crear carpeta si no existe
#
# @router.route('/save_image', methods=['POST','GET'])
# def save_image():
#     # data = request.get_json()
#
#     # if 'image_path' not in data:
#     #     return {"error": "Falta la ruta del archivo"}
#
#     # source_path = data['image_path']
#
#     source_path='/home/gomez/Descargas/tux.jpg'
#     # Verificar que el archivo existe
#     if not os.path.exists(source_path):
#         return {"error": "El archivo no existe"}
#
#     # Obtener el nombre del archivo
#     filename = os.path.basename(source_path)
#
#     # Definir la ruta destino en el servidor
#     destination_path = os.path.join(UPLOAD_FOLDER, filename)
#
#     try:
#         shutil.copy(source_path, destination_path)  # Copiar imagen
#         return {"message": f"Imagen guardada en {destination_path}"}
#     except Exception as e:
#         return {"error": str(e)}
#

from flask import Blueprint,request,send_from_directory
from login_api.controllers.authManager.manageToken import checkAuth
import uuid
from models.modelORM import Images

images=Blueprint("_images",__name__)

@images.get("/upload/<path:filename>")
async def imagesF(filename):
    try:
        return send_from_directory("uploads", filename)
    except:
        return {"Error": "Error interno en el servidor"}, 500


@images.route("/upload-cover", methods=["POST"])
@checkAuth
async def upload(l):
    if "file" not in request.files:
        return {"Error": "Falta el parametro file"}
    file = request.files["file"]
    if file.filename == "":
        return {"Error": "file invalid"}
    extension = file.filename.rsplit(".", 1)[1].lower()
    name = f"{uuid.uuid1()}.{extension}"
    fileFinal = f"uploads/{name}"
    file.save(fileFinal)
    Images.loadImage(name)
    return {
        "success": f"archivo {file.filename} subido correctamente",
        "filename": name,
    }

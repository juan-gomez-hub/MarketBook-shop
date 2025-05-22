import os


def upload_image(client, token, path):
    with open(path, "rb") as img_file:
        data = {"file": (img_file, os.path.basename(path), "image/jpg")}
        responseBin = client.post(
            "/market/upload-cover",
            data=data,
            content_type="multipart/form-data",
            headers={"Authorization": token},
        )
    assert b"success" in responseBin.data
    return responseBin.json.get("filename")

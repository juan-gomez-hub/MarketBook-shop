import pytest
from login_api.test.test_login import test_login_correct, test_login_correct_random
import json
from faker import Faker
import os
from test import data


def titleRandom():
    fake = Faker()
    return fake.bothify(text="?" * 65)


def test_login_correct_randomi(client, userParam=False):
    fake = Faker()
    user = fake.bothify(text="????####").capitalize() if not userParam else userParam
    email = (fake.bothify(text="?????").capitalize()) + "@hotmail.com"
    password = fake.bothify(text="????####").capitalize()
    print(f"cuenta: \nuser:{user}\nemail:{email}\npassword:{password}")
    creacion = client.post(
        "/api/accountManager/register",
        json={"user": user, "email": email, "password": password},
    ).data
    print(f"email es {email}")
    assert b"success" in creacion
    responseBin = client.post(
        "/api/accountManager/login", json={"user": user, "password": password}
    )
    assert b"success" in responseBin.data
    token = responseBin.json.get("success", {}).get("token")
    assert token is not None
    return token


def test_makeme_author(client):
    token = test_login_correct_randomi(client)
    responseBin = client.post(
        "/market/makeme/author",
        headers={"Authorization": token},
        json={"name": "donda2", "biography": "asd"},
    )
    assert b"success" in responseBin.data
    return responseBin.headers.get("Authorization")


def upload_image(client, token,path):
    with open(path, "rb") as img_file:
        data = {"file": (img_file,os.path.basename(path),"image/jpg")}
        responseBin = client.post(
            "/market/upload-cover",
            data=data,
            content_type="multipart/form-data",
            headers={"Authorization": token},
        )
    assert b"success" in responseBin.data
    return responseBin.json.get("filename")


def test_create_book(client):
    tokenAuthor = test_makeme_author(client)
    book = data.book
    assert tokenAuthor is not None, "El login fallo"
    for libro in book:
        img = upload_image(client, tokenAuthor,libro.cover_image)
        responseBin = client.post(
            "/market/create/book",
            headers={"Authorization": f"{tokenAuthor}"},
            json={
                # "author": "Prueba Autor",
                "title": libro.title,
                "description": libro.description,
                "release_date": libro.release_date,
                "cover_image"if img else "": img,
                "price": libro.price,
            },
        ).data
        assert b"Success" in responseBin

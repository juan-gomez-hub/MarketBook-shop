# test_app.py
from faker import Faker
import pytest
from time import sleep
# from test.conftest import client

@pytest.fixture
def test_login_correct(client, user="test2005", password="123456Test",email="teste1@hotmail.com"):
    client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    responseBin = client.post('/api/accountManager/login',
                           json={"user": user,"password":password})
    assert b"success" in responseBin.data
    token = responseBin.json.get("success", {}).get("token")
    assert token is not None
    return token


@pytest.fixture
def test_login_correct_random(client):
    fake=Faker()
    user=fake.bothify(text="????####").capitalize()
    email=((fake.bothify(text="?????").capitalize())+"@hotmail.com")
    password=fake.bothify(text="????####").capitalize()
    creacion=client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    print(f"email es {email}")
    assert b"success" in creacion
    responseBin = client.post('/api/accountManager/login',
                           json={"user": user,"password":password})
    assert b"success" in responseBin.data
    token = responseBin.json.get("success", {}).get("token")
    assert token is not None
    return token



def test_user_incorrect(client, user="UsuarioIncorrect", password="Messias."):
    response = client.post('/api/accountManager/login',json={
        "user": user,
        "password": password
    }).data
    assert b"error" in response
    assert b"el usuario ingresado" in response

def test_pass_incorrect(client,user="bicicleta22",email="testeando@outlook.com",password="Automovil20"):
    client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    
    response = client.post('/api/accountManager/login',json={
        "user": user,
        "password": password.__add__("xd")
    }).data

    assert b"error" in response
    assert b"contrase" and b"incorrecta" in response

def test_parameters_invalid(client):
    response =client.post('/api/accountManager/login',json={
        "user":15,
        "password":16
    }).data
    assert b"error" in response
    assert b"El usuario" in response


# !!!!la siguente funcion realentiza la aplicacion durante 60 segundos-
# ya que es para verificar su utilizacion

# @pytest.mark.parametrize("user, password", [
#     (user_test, password_test)
# ])
# def test_endpoint_with_refreshed_token(client,user,password):
#       #login
#       login_response = client.post('/api/accountManager/login',
#                                    json={"user": user, "password": password}).data
#       token = login_response.json["success"]["token"]
#       #refresh
#       duration=int(env("TOKEN_DURATION"))
#       sleep((duration*60)-6)
#       refresh_response = client.post('/api/authToken/refreshToken', headers={'Authorization': token}).data
#       refreshedToken=refresh_response.json["token"]
#       #test
#       test_response = client.post('/api/authToken/test', headers={'Authorization': refreshedToken}).data
#       assert b"success" in test_response
#

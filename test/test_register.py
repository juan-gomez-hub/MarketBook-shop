import pytest

def test_create_account(client, user="test2021", password="123456Test", email="test2021@hotmail.com"):
    """Verifica la creacion de usuario correcta."""
    response = client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    assert b"success" in response

def test_create_user_already_exist(client, user="test2021", password="123456Test", email="test2021@hotmail.com"):
    """Verifica si un usuario ya existe en la base de datos."""
    client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    response = client.post('/api/accountManager/register', json={
        "user": user,
        "email": email,
        "password": password
    }).data
    assert b"error" in response
    assert b"el usuario ingresado corresponde a una cuenta existente" in response 

def test_create_user_invalid_email(client):
    """Verifica que no se pueda registrar un usuario con un email inválido."""
    response = client.post('/api/accountManager/register', json={
        "user": "userInvalid",
        "email": "invalid-email",
        "password": "Password123"
    }).data
    assert b"error" in response
    assert b"Email invalido" in response

def test_create_user_weak_password(client):
    """Verifica que no se pueda registrar un usuario con una contraseña débil."""
    response = client.post('/api/accountManager/register', json={
        "user": "userWeakPass",
        "email": "weakpass@hotmail.com",
        "password": "123"
    }).data
    assert b"error" in response
    assert b"La contrase" in response

def test_create_user_missing_fields(client):
    """Verifica que no se pueda registrar un usuario con campos faltantes."""
    response = client.post('/api/accountManager/register', json={
        "user": "userNoEmail",
        "password": "Password123"
    }).data
    assert b"error" in response
    assert b"parametros incorrectos" in response

def test_create_user_short_username(client):
    """Verifica que no se pueda registrar un usuario con un nombre de usuario demasiado corto."""
    response = client.post('/api/accountManager/register', json={
        "user": "us",
        "email": "shortuser@hotmail.com",
        "password": "Password123"
    }).data
    assert b"error" in response
    assert b"Usuario invalido" in response


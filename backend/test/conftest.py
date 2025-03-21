import pytest
from server import create_app, db

@pytest.fixture()
def app():
    app=create_app(False)
    with app.app_context():
        try:
            db.create_all()
            print("[INFO] Base de datos creada exitosamente.")
        except Exception as e:
            print(f"[ERROR] Error al crear la base de datos: {e}")
            raise  # Relanza la excepción para que pytest lo detecte como un fallo.
    # app.run()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()

# def test_login_correct(client, user="test2005", password="123456Test",email="teste1@hotmail.com"):
#     # expected_result=
#     response = client.post('/api/accountManager/register', json={
#         "user": user,
#         "email": email,
#         "password": password
#     })
#     print(f'esto es: ${response.json}')
#     # print(response.json)
#     response1 = client.post('/api/accountManager/login',
#                            json={"user": user,"password":password})
#     print(response1.json)
#     assert b"success" in response1.data
#     token = response1.json.get("success", {}).get("token")
#     assert token is not None

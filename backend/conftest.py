import pytest
# from app import create_app, db
from app import create_app, db
# from server import create_app, db

@pytest.fixture()
def app():
    app=create_app(testing=True)
    # with app.app_context():
    #     try:
    #         db.create_all()
    #         print("[INFO] Base de datos creada exitosamente.")
    #     except Exception as e:
    #         print(f"[ERROR] Error al crear la base de datos: {e}")
    #         raise  # Relanza la excepción para que pytest lo detecte como un fallo.
    # # app.run()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


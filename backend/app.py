import os
from flask import Flask
from flask_mail import Mail
from login_api.config.configMail import ConfigMail
from models.modelORM import db, Book
import pymysql
from router import router

# from dotenv import load_dotenv
from flask_migrate import Migrate, migrate
from router import router_login_api
from flask_cors import CORS, cross_origin

pymysql.install_as_MySQLdb()

env = os.getenv
migrate = Migrate()


from models.modelORM import *
from login_api.models.modelsORM import *


def create_db(app: Flask, testing: bool):
    # initialize the app with the extension
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        # db.drop_all()
        db.create_all()


def create_app(testing=False):
    app = Flask(__name__)
    mail = Mail(app)
    app.config.update(vars(ConfigMail))
    app.register_blueprint(router)
    app.config["PATH_COVERS"] = "/home/gomez/Desktop/images/"
    # cors = CORS(app)
    cors = CORS(app, expose_headers=["Authorization"])

    # CORS(app, resources={r"/market/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        env("URL_DB_TESTING") if (testing) else env("URL_DB")
    )
    create_db(app, testing)
    # Book.listBook(5)
    mail.init_app(app)
    return app


if __name__ == "__main__":
    create_app()

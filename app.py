import os
from flask import Flask
from models.modelORM import db
import pymysql
from router.router import router
from dotenv import load_dotenv
from flask_migrate import Migrate, migrate
from router.router import router_login_api

pymysql.install_as_MySQLdb()

env = os.getenv
migrate = Migrate()

from models.modelORM import *
from login_api.models.modelsORM import *
def create_db(app):
    # initialize the app with the extension
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.drop_all()
        db.create_all()

def create_app():
    app = Flask(__name__)
    app.register_blueprint(router)

    app.config["SQLALCHEMY_DATABASE_URI"] = env("URL_DB")
    create_db(app)
    
    app.register_blueprint(router_login_api)
    return app


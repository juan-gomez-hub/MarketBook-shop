import os
from flask import Flask
from models.modelORM import db
import pymysql
from router.router import router
from dotenv import load_dotenv
from flask_migrate import Migrate, migrate

pymysql.install_as_MySQLdb()

env=os.getenv
migrate=Migrate()
def create_app():
    app = Flask(__name__)
    app.register_blueprint(router)
    app.config["SQLALCHEMY_DATABASE_URI"] = env("URL_DB") 
    # initialize the app with the extension
    db.init_app(app)
    migrate.init_app(app,db)
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()

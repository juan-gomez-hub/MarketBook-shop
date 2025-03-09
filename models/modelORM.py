from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy import text
from datetime import datetime
from sqlalchemy import false
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from typing import Optional

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "ACCOUNTS"
    _id = db.Column(db.Integer(), primary_key=True, unique=True)
    user = db.Column(db.String(70), nullable=False, unique=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(70), nullable=False)
    code = db.Column(db.Integer())
    expCode = db.Column(db.DateTime())
    role= db.Column(db.Integer(),default={0})

from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy import text
from datetime import datetime
from sqlalchemy import false
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from typing import Optional
from sqlalchemy import Integer,Column,String,Float,ForeignKey

from login_api.models.modelsORM import User   
from . import db
# db = SQLAlchemy()

class Book(db.Model):
    __tablename__ = "MS_BOOK"
    _id = Column(Integer(), primary_key=True, unique=True)
    title = Column(String(70), nullable=False, unique=True)
    author = Column(String(70), nullable=False)
    description = Column(Integer())


class Authors(db.Model):
    __tablename__ = "MS_AUTHOR"
    _id = Column(Integer(), primary_key=True, unique=True)
    name=Column(String(30),nullable=False)

class Sales(db.Model):
    __tablename__ = "MS_SALES"
    _id = db.Column(db.Integer(), primary_key=True, unique= True)
    price = db.Column(db.Float(),nullable=False)
    author_id = db.Column(db.Integer(),ForeignKey('MS_AUTHOR._id',ondelete="CASCADE"),nullable=False)
    book_id = db.Column(db.Integer(),ForeignKey('MS_BOOK._id',ondelete="CASCADE"),nullable=False)

# class Parent(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), nullable=False)
#     # children = db.relationship("Child", backref="parent", cascade="all, delete", passive_deletes=True)
#
# class Child(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     parent_id = db.Column(db.Integer, db.ForeignKey("parent.id", ondelete="CASCADE"), nullable=False)
#     name = db.Column(db.String(100), nullable=False)

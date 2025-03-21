from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy import text
from datetime import datetime
from sqlalchemy import false
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from typing import Optional
from sqlalchemy import Integer,Column,String,Float,ForeignKey,DateTime
from datetime import datetime

# from login_api.models.modelsORM import User   
from . import db
# db = SQLAlchemy()

class Book(db.Model):
    __tablename__ = "MS_BOOK"
    _id = Column(Integer(), primary_key=True, unique=True,autoincrement=True)
    title = Column(String(70), nullable=False, unique=True)
    author = Column(String(70), nullable=False)
    description = Column(String(250), nullable=False)
    release_date = Column(DateTime(),nullable=False)
    
    @classmethod
    def createBook(cls,titleParam,authorParam,descriptionParam):
        # dato=datetime(2015, 6, 5, 8, 10, 10, 10)
        fecha_str = "1995-07-15"
        fecha_convertida = datetime.strptime(fecha_str, "%Y-%m-%d").date()
        db.session.add(Book(title=titleParam,author=authorParam,description=descriptionParam,release_date=fecha_convertida))
        db.session.commit()

    @classmethod
    def deleteBook(cls,authorParam):
        db.session.delete(Book(author=authorParam))
        db.session.commit()



class Authors(db.Model):
    __tablename__ = "MS_AUTHOR"
    _id = Column(Integer(), primary_key=True, unique=True,autoincrement=True)
    name=Column(String(30),nullable=False)
    account_id = db.Column(db.Integer(),ForeignKey('LA_ACCOUNTS._id',ondelete="CASCADE"),nullable=True)

    @classmethod
    def createAuthor(cls,nameParam,account_idParam):
        db.session.add(Authors(name=nameParam,account_id=account_idParam))
        db.session.commit()


class Sales(db.Model):
    __tablename__ = "MS_SALES"
    _id = db.Column(db.Integer(), primary_key=True, unique= True,autoincrement=True)
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

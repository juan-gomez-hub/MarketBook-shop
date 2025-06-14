from enum import unique

from pymysql import NULL
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy import text
from datetime import datetime
from sqlalchemy import false
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from typing import Optional
from sqlalchemy import Integer, Column, String, Float, ForeignKey, DateTime, Text
from datetime import datetime
from flask import current_app, request
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.datastructures import auth
from werkzeug.utils import secure_filename
from collections import Counter

from . import db
import uuid


class Images(db.Model):
    __tablename__ = "MS_IMAGES"
    _id = Column(Integer(), primary_key=True, unique=True, autoincrement=True)
    filename = Column(
        String(42),
        # primary_key=True,
        unique=True,
    )

    @classmethod
    def loadImage(cls, filenameParam):
        db.session.add(Images(filename=filenameParam))
        db.session.commit()

    @classmethod
    def verifyIfExistImage(cls, filenameParam):
        return (
            db.session.query(cls).filter_by(filename=filenameParam).first() is not None
        )


class Book(db.Model):
    __tablename__ = "MS_BOOK"
    # _id = Column(Integer(), primary_key=True, unique=True, autoincrement=True)
    title = Column(String(70), nullable=False, unique=False)
    description = Column(Text(), nullable=False, unique=False)
    release_date = Column(DateTime(), nullable=False, unique=False)
    author_id = db.Column(
        db.Integer(),
        ForeignKey("MS_AUTHOR.account_id", ondelete="CASCADE"),
        nullable=False,
    )
    cover_image = Column(String(42), ForeignKey("MS_IMAGES.filename"), nullable=True)
    # cover_image = db.Column(String(250), nullable=True, unique=False)
    price = db.Column(Float(), nullable=False, unique=False)
    uuid = db.Column(
        String(36), primary_key=True, unique=True, default=lambda: str(uuid.uuid4())
    )
    # books = db.relationship("Book", backref="author", cascade="all, delete", passive_deletes=True)

    @classmethod
    def listBook(cls, page, per_page):
        if not page or page <= 0:
            return false
        offset = (page - 1) * per_page
        total_books = db.session.query(Book).join(Book.author).count()
        books = (
            db.session.query(Book)
            .join(Book.author)
            .order_by(Book.title.asc())
            .offset(offset)
            .limit(per_page)
            .all()
        )
        if not books:
            return False
        return {
            "total_books": total_books,
            "per_page":per_page,
            "books": [book.to_dict_public() for book in books],
        }

    @classmethod
    def listYourBook(cls, id):
        author_id = Authors.getAuthor_id(id)
        your_books = (
            db.session.query(Book)
            .join(Book.author)
            .filter(Book.author_id == author_id)
            .all()
        )
        return [book.to_dict_public() for book in your_books]

    def to_dict_public(self):
        return {
            "author":self.author.name,
            "reference": self.uuid,
            "title": self.title,
            "description": self.description,
            "release_date": (
                self.release_date.isoformat() if self.release_date else None
            ),
            # "author_id": self.author_id,
            "cover_image": (
                "http://localhost:5000/market/upload/" + self.cover_image
                if self.cover_image
                else None
            ),
            "price": self.price,
        }

    @classmethod
    def getCart(cls, cart):
        results = (
            db.session.query(Book, Authors.name)
            .join(Authors, Book.author_id == Authors.account_id)
            .filter(Book.uuid.in_(cart))
            .all()
        )

        books = []
        for book, author_name in results:
            book_dict = book.to_dict_public()
            book_dict["author"] = author_name
            book_dict["cant"] = Counter(cart).get(book_dict["reference"])
            books.append(book_dict)
        return books

    @classmethod
    def modifyYourBook(
        cls,
        paramAccount_id,
        paramReference=None,
        paramTitle=None,
        paramDescription=None,
        paramReleaseDate=None,
        paramCover_image=None,
        paramPrice=None,
    ):
        author = Authors.query.filter_by(account_id=paramAccount_id).first()
        local = cls.query.filter_by(uuid=paramReference, author_id=author._id).first()
        if local:
            local.title = paramTitle if paramTitle is not None else local.title
            local.description = (
                paramDescription if paramDescription is not None else local.description
            )
            local.release_date = (
                paramReleaseDate if paramReleaseDate is not None else local.release_date
            )
            local.cover_image = (
                paramCover_image if paramCover_image is not None else local.cover_image
            )
            local.price = paramPrice if paramPrice is not None else local.price

            db.session.commit()
            return local

    @classmethod
    def getYourBook(cls, paramAccount_id, paramReference):
        author = Authors.query.filter_by(account_id=paramAccount_id).first()
        book = cls.query.filter_by(uuid=paramReference, author_id=author._id).first()
        if book:
            return book.to_dict()
        return None

    def to_dict(self):
        return {
            key: value
            for key, value in self.__dict__.items()
            if key != "_sa_instance_state"
        }

    @classmethod
    def createBook(
        cls,
        titleParam,
        descriptionParam,
        account_idParam,
        release_dateParam,
        cover_imageParam,
        priceParam,
    ):
        # Buscar el autor por account_id
        author = Authors.query.filter_by(account_id=account_idParam).first()
        if not author:
            raise ValueError("Autor con ese account_id no encontrado")

        fecha_convertida = datetime.strptime(release_dateParam, "%Y-%m-%d").date()

        nuevo_libro = Book(
            title=titleParam,
            description=descriptionParam,
            release_date=fecha_convertida,
            author_id=author._id,
            cover_image=cover_imageParam,
            price=priceParam,
        )

        db.session.add(nuevo_libro)
        db.session.commit()

    @classmethod
    def deleteBook(cls, authorParam):
        db.session.delete(Book(author=authorParam))
        db.session.commit()


class Authors(db.Model):
    __tablename__ = "MS_AUTHOR"
    _id = Column(Integer(), primary_key=True, unique=True, autoincrement=True)
    name = Column(String(16), nullable=False,unique=True)
    biography = Column(String(60), nullable=False)
    image = Column(String(42), ForeignKey("MS_IMAGES.filename"), nullable=True)
    # birth_date = Column(DateTime(), nullable=False, unique=False)
    account_id = db.Column(
        db.Integer(),
        ForeignKey("LA_ACCOUNTS._id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    books = db.relationship(
        "Book", backref="author", cascade="all, delete", passive_deletes=True
    )

    # @classmethod
    def __init__(self, name, biography, account_id, image=None):
        self.name = name  # atributo de instancia
        self.biography = biography  # atributo de instancia
        self.account_id = account_id
        if image is not None:
            self.image = image

    @classmethod
    def getAuthor_id(cls, account_id):
        result = cls.query.filter(cls.account_id == account_id).first()
        return result._id

    @classmethod
    def create_author(cls, name, biography, account_id, image=None):
        nameInDB=cls.query.filter(cls.name==name).first()
        if nameInDB:
            raise ValueError(f"El nombre ingresado corresponde a una cuenta existente")
        if image is not None:
            author = cls(
                name=name, biography=biography, account_id=account_id, image=image
            )
        else:
            author = cls(name=name, biography=biography, account_id=account_id)
        db.session.add(author)
        db.session.commit()

    @classmethod
    def selectAuthorInfo(cls, param) -> Optional["Authors"]:
        #     resultado=db.session.execute(db.select(Authors).filter_by(account_id=account_id)).scalar_one()
        #     return resultado
        # def selectUserByName(cls,userName=None)-> Optional['User']:
        return cls.query.filter_by(account_id=param).first()


class Sales(db.Model):
    __tablename__ = "MS_SALES"
    _id = db.Column(db.Integer(), primary_key=True, unique=True, autoincrement=True)
    price = db.Column(db.Float(), nullable=False)
    author_id = db.Column(
        db.Integer(), ForeignKey("MS_AUTHOR._id", ondelete="CASCADE"), nullable=False
    )
    book_id = db.Column(
        db.String(36), ForeignKey("MS_BOOK.uuid", ondelete="CASCADE"), nullable=False
    )

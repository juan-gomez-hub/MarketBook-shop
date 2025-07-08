import code
import email
import bcrypt
from flask import session
from flask_sqlalchemy import SQLAlchemy
import pymysql
import sqlalchemy as sa
from sqlalchemy import text
from datetime import datetime
from sqlalchemy import false
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import UniqueConstraint
from typing import Optional

from models import db
from models.modelORM import Authors
# db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "LA_ACCOUNTS"
    _id = db.Column(db.Integer(), primary_key=True, unique=True)
    user = db.Column(db.String(70), nullable=False, unique=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(70), nullable=False)
    code = db.Column(db.Integer())
    expCode = db.Column(db.DateTime())
    role= db.Column(db.Integer(),default={0})

    @classmethod
    def selectUserByName(cls,userName=None)-> Optional['User']:
        return (cls.query.filter_by(user=userName).first())

    @classmethod
    def selectUserById(cls,id=None)-> Optional['User']:
        return (cls.query.filter_by(_id=id).first())

    # @classmethod
    # def selectUserById(id=None)-> Optional['User']:
    #     return (User.query.filter_by(_id=id).first())

    # @classmethod
    def changeRole(id,roleToChange):
       User.query.filter_by(_id=id).update({
            User.role:roleToChange
        })
       print(f"accaaaa xd id:{id} role:{roleToChange}")
       db.session.commit()
    
    @classmethod
    def selectUserByEmail(cls,email=None)-> Optional['User']:
        return (cls.query.filter_by(email=email).first())
    
    @classmethod
    def createAccount(cls,email=None,userName=None,password=None):
        user=User(email=email,user=userName,password=password)
        db.session.add(user)
        db.session.commit()
        # Authors.createAuthor(nameParam=user.user,account_idParam=user._id)

    @classmethod
    def refreshRecoveryCode(cls,code,codeExp,email):
        cls.query.filter_by(email=email).update({
            User.code:code,
            User.expCode:codeExp
        })
        db.session.commit()

    @classmethod
    def changePass(cls,password,emailField):
        # Hash the new password
        password_bytes = password.encode('utf-8')
        password_hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt(13))
        password_hashed_str = password_hashed.decode('utf-8')
        #user_to_update = cls.query.filter_by(email=emailField).first()
        cls.query.filter_by(email=emailField).update({
            User.code:None,
            User.password:password_hashed,
            User.expCode:None,
        })
        try:
            db.session.commit()
        except Exception as e:
            print("Error al actualizar la contraseña:", e)

    @classmethod
    async def verifyExistCode(cls,code):
        CodeInAccount = db.session.query(User).filter_by(code=code).first()
        db.session.commit()
        if(not CodeInAccount):
            return False
        return True

    @classmethod
    async def getCode(cls,code,email):
        hourNow=datetime.now()
        CodeInAccount = db.session.query(User).filter_by(email=email,code=code).first()
        db.session.commit()
        if(not CodeInAccount):
            return False
        if(CodeInAccount.expCode<hourNow):
            return False
        return True

    
class blackList(db.Model):
    __tablename__ = "LA_BLACKLIST"
    _id = db.Column(db.Integer(), primary_key=True)
    token = db.Column(db.String(200), nullable=False, unique=True)

    @classmethod
    def tokenOnBlacklist(cls,token):
        token = db.session.query(blackList).filter_by(token=token).first()
        db.session.commit()
        if(not token):
            return False
        return True
    
    @classmethod
    def addTokenToBlackList(cls,token):
        tokenLocal=db.session.query(blackList).filter_by(token=token).first()
        if(not tokenLocal):
            db.session.add(blackList(token=str(token)))
            db.session.commit()


class blackListCode(db.Model):
    __tablename__ = "LA_BLACKLIST_CODE"
    _id = db.Column(db.Integer(), primary_key=True)
    codeExpired = db.Column(db.Integer())

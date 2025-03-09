from flask import Blueprint, Flask
# from yourapplication.simple_page import simple_page

# app = Flask(__name__)
router=Blueprint('prueba',__name__)

@router.route('/' )
def prueba():
    return{"sdfs":"xd"}


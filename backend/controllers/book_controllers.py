from flask import Blueprint,request
from models.modelORM import Authors, Book
from datetime import datetime

book=Blueprint('author',__name__)

def validationJsonAuthor(data,required_keys):
    missing_keys = [key for key in required_keys if key not in data or not data[key]]
    if missing_keys:
        raise ValueError(f"Missing parameters: {', '.join(missing_keys)}")
    if not is_valid_date(data['release_date']):
        raise ValueError("The format of date_release is Y-m-d")

def is_valid_date(date_str):
    """Verifica si la fecha tiene el formato correcto (YYYY-MM-DD)."""
    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


@book.get('/create/author')
def prueba():
    json=request.get_json()
    required=['author','title','description','release_date']
    try:
        validationJsonAuthor(data=json,required_keys=required)
    except ValueError as e:
        return{"error":f"{e}"}
    # book=json['author']
    # title=json['title']
    # description=json['description']
    # release_date=json['release_date']
    Book.createBook(titleParam="asd", authorParam=1,descriptionParam="asdasd")
    return{"sad":"sdfsdf"}
    # return{"esto es :":f"{json['asd']}"}



import re

from login_api.utils.customsExceptions import invalid

def validateEmail(correo):
    if(not isinstance(correo,str)):
        return False
    # Define el patrón de expresión regular para una dirección de correo electrónico
    patron = r'^[\w\.-]+@[\w\.-]+$'
    # Utiliza la función search de la biblioteca re para buscar coincidencias
    if re.search(patron, correo):
        return True
    else:
        return False
                
def validatePass(password):
      #verifica que tenga mas de 4 digitos y 18 digitos, y al menos una mayuscula
    if(not isinstance(password,str)):
        return False
    if(len(password)<4 or len(password)>18):
      return False
    return True  

def validateUser(user):
    if(not isinstance(user,str)):
        return False
    if(len(user)<4 or len(user)>18):
        return False
    patron = r'^[\w\.-]+$'
    # Utiliza la función search de la biblioteca re para buscar coincidencias
    if re.search(patron, user):
        return True
    else:
        return False
    
def validateCode(code):
    if(not isinstance(code,int)):
        return False
    if code >= 10^8 and code <= 10^9:
        return True
    else:
        return False

async def validate(fieldUser=None, fieldEmail=None, fieldPassword=None,fieldCode=None):
    if fieldUser is not None and not validateUser(fieldUser):
      raise invalid.User
    if fieldEmail is not None and not validateEmail(fieldEmail):
      raise invalid.Email
    if fieldPassword is not None and not validatePass(fieldPassword):
      raise invalid.Password
    if fieldCode is not None and not validatePass(fieldPassword):
      raise invalid.Code

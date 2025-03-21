from login_api.utils import codes as iCodes

# def Errors(error, errorCode: int = 0):  # Usando 'int' en lugar de 'iCodes'
#     return vars(rErrors(error, errorCode))
#
# class rErrors:
#     def __init__(self, error, errorCode: int = 0):  # Usando 'int' en lugar de 'iCodes'
#         self.error = error
#         if errorCode is not 0:
#             self.errorCode = errorCode
#
# class rSuccess:
#     def __init__(self, success: str):
#         self.success = success
def Errors(error,errorCode:iCodes=None):
     # @pyright-ignore[reportGeneralTypeIssues]
    #vars funciona parecido a dict
    return vars(rErrors(error,errorCode))

def Success(success):
    return vars(rSuccess(success))

class rErrors:
    def __init__(self,error,errorCode:iCodes=None):
        self.error=error
        if(errorCode!=None):self.errorCode=errorCode

class rSuccess:
    def __init__(self,success:str):
         self.success=success

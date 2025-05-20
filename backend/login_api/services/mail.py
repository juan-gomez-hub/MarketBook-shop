from flask_mail import Mail,Message
from flask import Blueprint,request
from login_api.extension import mail


def enviar_correo(destinatary,asunto, message):

        try:
        # Crea un objeto Message para el correo electrónico
            msg = Message(asunto, recipients=[destinatary])
            msg.body = message
        # Envía el correo electrónico
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Error al enviar el correo: {e}")  # También puedes usar logging
            return False

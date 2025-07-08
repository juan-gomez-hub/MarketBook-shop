from dotenv import load_dotenv,dotenv_values
import os
load_dotenv()

env=os.getenv

class ConfigMail(object):
    SECRET_KEY='my_secret_key'
    MAIL_SERVER=env("MAIL_SERVER")
    MAIL_PORT=465
    MAIL_USE_SSL=True
    MAIL_USE_TLS=False
    MAIL_DEBUG=False
    MAIL_USERNAME=env("MAIL_USERNAME")
    MAIL_PASSWORD=env("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = env("MAIL_USERNAME")



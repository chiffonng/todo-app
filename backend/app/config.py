import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, ".env"))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SERVER_NAME = "127.0.0.1:5000"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAME_SITE = "None"

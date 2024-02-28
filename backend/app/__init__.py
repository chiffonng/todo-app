from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

from .config import Config

db = SQLAlchemy()
login_manager = LoginManager()


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Bind extensions to the app
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "Welcome to the backend!"

    return app

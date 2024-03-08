from flask import Flask
from flask_login import LoginManager
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy

from .config import Config
from .uri import API_ENDPOINT

db = SQLAlchemy()
login_manager = LoginManager()
api = Api(version="0.1", doc=API_ENDPOINT, title="Todo API", validate=True)


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Import the namespaces
    from .auth import auth_ns
    from .list import list_ns
    from .task import task_ns

    # Add the namespaces to the API
    api.add_namespace(auth_ns)
    api.add_namespace(list_ns)
    api.add_namespace(task_ns)

    # Bind extensions to the app
    db.init_app(app)
    login_manager.init_app(app)
    api.init_app(app)

    with app.app_context():
        db.create_all()

    return app

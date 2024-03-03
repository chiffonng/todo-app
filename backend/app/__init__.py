from flask import Flask
from flask_login import LoginManager
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy

from .config import Config

db = SQLAlchemy()
login_manager = LoginManager()
api = Api(version="0.1", doc="/api", title="Todo API", validate=True)


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Import namespaces
    from .auth import auth_ns
    from .list import list_bp

    # Bind extensions to the app
    db.init_app(app)
    login_manager.init_app(app)
    api.init_app(app)

    # Register namespaces
    api.add_namespace(auth_ns)
    app.register_blueprint(list_bp)

    with app.app_context():
        db.create_all()

    return app

import pytest
from backend.app import create_app, db
from backend.app.models import User


@pytest.fixture(scope="module")
def test_app():
    """
    Create a Flask application configured for testing.
    """
    app = create_app({"TESTING": True, "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})

    # Create the database and the database table
    with app.app_context():
        db.create_all()

    yield app

    # Drop the database and the database table
    with app.app_context():
        db.drop_all()


@pytest.fixture(scope="module")
def test_client(test_app):
    """
    A test client for the Flask application.
    """
    return test_app.test_client()


@pytest.fixture(scope="module")
def test_runner(test_app):
    """
    A test runner for the Flask application.
    """
    return test_app.test_cli_runner()


@pytest.fixture(scope="module")
def init_database():
    """
    Initialize the database with test data.
    """
    user = User(username="testuser", password="testpassword")
    db.session.add(user)
    db.session.commit()

    yield db

    db.session.close()
    db.drop_all()

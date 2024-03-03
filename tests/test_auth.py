import pytest
from flask import url_for

from tests.conftest import test_app, test_client


@pytest.fixture(scope="module")
def test_user() -> dict:
    """
    Create a user for testing in terms of JSON
    """
    return {
        "username": "testuser",
        "password": "testpassword",
    }


def test_login(test_app, test_client, test_user):
    """
    GIVEN a Flask application
    WHEN the '/auth/login' route is requested (POST)
    THEN check the response is valid
    """
    with test_app.app_context():
        response = test_client.post(
            url_for("auth_login"),
            json=test_user,
        )
        assert response.status_code == 200
        assert response.json.get("message") == "Login succeeded"
        assert response.json.get("user").get("username") == test_user.get("username")

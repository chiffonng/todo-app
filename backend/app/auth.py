from typing import Tuple

from flask import Response, jsonify, request
from flask_login import login_user, logout_user
from flask_restx import Namespace, Resource, fields
from sqlalchemy.exc import IntegrityError

from . import api, db, login_manager
from .models import User
from .uri import (
    AUTH_ENDPOINT,
    LOGIN_ENDPOINT,
    LOGOUT_ENDPOINT,
    REGISTER_ENDPOINT,
    CURRENT_USER_ENDPOINT,
)
from .utils import standardize_response

auth_ns = api.namespace("auth", description="User authentication", path=AUTH_ENDPOINT)

user_model = auth_ns.model(
    "User",
    {
        "username": fields.String(
            required=True, description="The username", min_length=3, max_length=32
        ),
        "password": fields.String(
            required=True,
            description="The plaintext password",
            min_length=3,
            max_length=64,
        ),
    },
)


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, user_id)


@auth_ns.route(LOGIN_ENDPOINT)
class Login(Resource):
    @auth_ns.expect(user_model)
    @auth_ns.response(200, "Login succeeded")
    @auth_ns.response(401, "Invalid username or password")
    @auth_ns.response(400, "Failed to log in")
    @auth_ns.response(500, "Internal server error")
    @auth_ns.doc("Log in a user")
    def post(self) -> Tuple[Response, int]:
        """Log in a user with a username and password."""
        try:
            username = request.json.get("username")
            password = request.json.get("password")

            query_user = db.select(User).filter_by(username=username)
            user = db.session.execute(query_user).scalar_one_or_none()

            # if user exists and password is correct
            if user and user.is_password_correct(password):
                login_user(user, remember=True)
                return standardize_response(
                    "Successfully logged in",
                    200,
                    {"username": user.username, "id": user.id},
                )
            else:
                return standardize_response("Invalid username or password", 401)
        except Exception as e:
            return standardize_response(f"Failed to log in. Error: {e}", 500)


@auth_ns.route(REGISTER_ENDPOINT)
class Register(Resource):
    @auth_ns.expect(user_model)
    @auth_ns.response(201, "Created a new user")
    @auth_ns.response(400, "Failed to create a new user")
    @auth_ns.response(500, "Internal server error")
    def post(self) -> Tuple[Response, int]:
        """Create a new user."""
        try:
            username = request.json.get("username")
            password = request.json.get("password")

            user_exists = db.session.execute(
                db.select(User).filter_by(username=username)
            ).scalar_one_or_none()

            if user_exists is not None:
                return standardize_response(
                    "Username already exists. Please choose a different one", 400
                )

            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()

            return standardize_response(
                "Successfully created a new user",
                201,
                new_user.to_dict(),
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to create a new user. Error: {e}", 500)


@auth_ns.route(LOGOUT_ENDPOINT)
class Logout(Resource):
    @auth_ns.response(200, "Successfully logged out")
    @auth_ns.response(400, "Failed to log out")
    @auth_ns.response(500, "Internal server error")
    def post(self) -> Tuple[Response, int]:
        """Log out a user."""

        try:
            logout_user()
            return standardize_response("Successfully logged out", 200)
        except Exception as e:
            return standardize_response(f"Failed to log out. Error: {e}", 500)


@auth_ns.route(CURRENT_USER_ENDPOINT)
class CurrentUser(Resource):
    @auth_ns.response(200, "User information")
    @auth_ns.response(400, "Failed to get user information")
    @auth_ns.response(500, "Internal server error")
    def get(self) -> Tuple[Response, int]:
        """Get user information."""
        try:
            if not request.user.is_authenticated:
                return standardize_response("User is not authenticated", 400)

            return standardize_response(
                "Successfully retrieved user information",
                200,
                {"username": request.user.username, "id": request.user.id},
            )
        except Exception as e:
            return standardize_response(
                f"Failed to get user information. Error: {e}", 500
            )

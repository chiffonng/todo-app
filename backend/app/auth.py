from typing import Tuple

from flask import Response, jsonify, request
from flask_login import login_user, logout_user
from flask_restx import Namespace, Resource, fields
from sqlalchemy.exc import IntegrityError

from . import api, db
from .models import User
from .uri import (
    AUTH_ENDPOINT,
    LOGIN_ENDPOINT,
    LOGOUT_ENDPOINT,
    REGISTER_ENDPOINT,
)

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
                return {"message": "Successful login", "user": user.to_dict()}, 200
            else:
                return {"message": "Invalid username or password"}, 401
        except Exception as e:
            return {"message": f"Failed to log in. Error: {e}"}, 500


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

            query_user = db.select(User).filter_by(username=username)
            user_exists = db.session.execute(query_user).scalar_one_or_none()
            if user_exists or IntegrityError:
                return {"message": "User already exists"}, 400

            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()

            return {
                "message": "Successfully created a new user",
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"message": f"Failed to create a new user. Error: {e}"}, 500


@auth_ns.route(LOGOUT_ENDPOINT)
class Logout(Resource):
    @auth_ns.response(200, "Successfully logged out")
    @auth_ns.response(400, "Failed to log out")
    @auth_ns.response(500, "Internal server error")
    def post(self) -> Tuple[Response, int]:
        """Log out a user."""

        try:
            logout_user()
            return {"message": "Successfully logged out"}, 200
        except Exception as e:
            return {"message": f"Failed to log out. Error: {e}"}, 500

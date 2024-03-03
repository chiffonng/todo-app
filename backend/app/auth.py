from typing import Tuple

from flask import Response, jsonify, request
from flask_login import login_user, logout_user
from flask_restx import Namespace, Resource, fields
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import BadRequest

from . import api, db
from .models import User

auth_ns = api.namespace("auth", description="User authentication")

user_model = auth_ns.model(
    "User",
    {
        "username": fields.String(required=True, description="The username"),
        "password": fields.String(required=True, description="The plaintext password"),
    },
)


@auth_ns.route("/login")
@auth_ns.route("/signin")
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

            query_user = db.select(User).where(User.username == username)
            user = db.session.execute(query_user).scalar_one_or_none()

            # if user exists and password is correct
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                return (
                    jsonify({"message": "Login succeeded", "user": user.to_dict()}),
                    200,
                )
            else:
                return jsonify({"message": "Invalid username or password"}), 401
        except Exception as e:
            return jsonify({"error": e}), 400


@auth_ns.route("/signup")
@auth_ns.route("/register")
class Register(Resource):
    @auth_ns.expect(user_model)
    @auth_ns.response(201, "User created")
    @auth_ns.response(400, "Failed to create a user")
    def post(self) -> Tuple[Response, int]:
        """Create a new user."""
        try:
            username = request.json.get("username")
            password = request.json.get("password")

            user_exists = db.session.execute(
                db.select(User).where(User.username == username).scalar_one_or_none()
            )

            if user_exists:
                return jsonify({"message": "Username already exists"}), 400

            new_user = User(
                username=username, password_hash=generate_password_hash(password)
            )
            db.session.add(new_user)
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Successfully created a new user",
                        "user": new_user.to_dict(),
                    }
                ),
                201,
            )
        except Exception as e:
            db.session.rollback()
            return (
                jsonify({"message": f"Failed to create a new user. Error {e}"}),
                400,
            )


@auth_ns.route("/logout")
class Logout(Resource):
    @auth_ns.response(200, "Successfully logged out")
    @auth_ns.response(400, "Failed to log out")
    def post(self) -> Tuple[Response, int]:
        """Log out a user."""

        try:
            logout_user()
            return jsonify({"message": "Successfully logged out"}), 200
        except Exception as e:
            return jsonify({"message": f"Error {e}"}), 400

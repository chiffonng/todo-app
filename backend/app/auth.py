from typing import Tuple

from flask import Blueprint, Response, jsonify, request
from flask_login import login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from . import db
from .models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login() -> Tuple[Response, int]:
    """Log in a user."""

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
        return jsonify({"message": "Failed to log in", "error": e}), 400


@auth_bp.route("/signup", methods=["POST"])
def signup() -> Tuple(Response, int):
    """Create a new user."""

    try:
        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")

        user_exists = db.session.execute(
            db.select(User).where(User.username == username).scalar_one_or_none()
        )

        if user_exists:
            return jsonify({"message": "Email address already exists"}), 400

        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
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
        return jsonify({"message": f"Failed to create a new user. error is {e}"}), 400


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Log out a user."""

    try:
        logout_user()
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to log out. error is {e}"}), 400

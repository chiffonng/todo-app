import re

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import InputRequired, Email, Length, EqualTo, ValidationError


class RegistrationForm(FlaskForm):
    username = StringField(
        "Username",
        validators=[
            InputRequired(message="Username required, between 4 and 32 characters"),
            Length(min=4, max=32),
        ],
    )
    email = StringField("Email", validators=[InputRequired(), Email()])
    password = PasswordField(
        "Password",
        validators=[
            InputRequired(),
            Length(min=8, max=32),
        ],
    )
    confirm = PasswordField(
        "Confirm Password",
        validators=[
            InputRequired(),
            Length(min=8, max=32),
            EqualTo("password", message="Passwords must match"),
        ],
    )
    remember_me = BooleanField("Remember me")
    submit = SubmitField("Register")

    def validate_username(form, username):
        user = select(User).where(username=username.data).first()
        if user:
            raise ValidationError("Username already exists")

    def validate_email(form, email):
        user = select(User).where(email=email.data).first()
        if user:
            raise ValidationError("Email already exists")

    def validate_password(form, password):
        if not re.search("[a-z]", password.data):
            raise ValidationError(
                "The password must contain at least one lowercase letter."
            )
        if not re.search("[A-Z]", password.data):
            raise ValidationError(
                "The password must contain at least one uppercase letter."
            )
        if not re.search("\d", password.data):
            raise ValidationError("The password must contain at least one number.")
        if not re.search("[^A-Za-z0-9]", password.data):
            raise ValidationError(
                "The password must contain at least one special character."
            )

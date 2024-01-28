import sqlalchemy as sa
from flask import flash, redirect, render_template, request, url_for
from flask_login import current_user, login_user, logout_user
from urllib.parse import urlsplit

from app import app, db
from app.models.models import User
from .forms import LoginForm, RegistrationForm


@app.route("/")
@app.route("/home")
def index():
    """Generate the home page."""

    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Generate the registration page and register the user.
    - If the user is already logged in, redirect to their to-do list.
    - If not, generate the registration page and register the user. The form validation is handled by the `RegistrationForm` class.
    """
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash("Login successful. Please log in.")
        return redirect(url_for("login"))
    return render_template("register.html", title="Register", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Generate the login page and log the user in.
    - If the user is already logged in, redirect to their to-do list.
    - If not, generate the login page
        - If the user is not found or the password is incorrect, flash a message and redirect to the login page.
        - If the user is found and the password is correct, log the user in.
    - If the user is redirected from another page with authentication required, redirect to that page after successful login. Otherwise, redirect to the home page.

    Returns:
        _type_: _description_
    """
    if current_user.is_authenticated:
        return redirect(url_for("home"))

    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data)
        )
        if user is None or not user.check_password(form.password.data):
            flash("Invalid username or password")
            return redirect(url_for("login"))

        login_user(user, remember=form.remember_me.data)
        return redirect(url_for("home"))

        next_page = request.args.get("next")
        if not next_page or urlsplit(next_page).netloc != "":
            next_page = url_for("index")
        return redirect(next_page)

    return render_template("login.html", title="Log In", form=form)


@app.route("/logout")
def logout():
    """Log the user out and redirect to the home page."""
    logout_user()
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(debug=True)

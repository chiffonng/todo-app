from flask import render_template, flash, redirect, url_for

from app import app
from .forms import RegistrationForm


@app.route("/")
def home():
    # Mock data for user lists and the current list with sections, tasks, and subtasks
    user = {"username": "chiffonng"}
    user_lists = [
        {"name": "Family"},
        {"name": "Study"},
        {"name": "Hobbies"},
    ]

    current_list = {
        "name": "Study",
        "description": "Tasks related to work",
        "sections": [
            {
                "title": "CS162",
                "tasks": [
                    {
                        "name": "Hierarchical Todo",
                        "subtasks": [
                            {"name": "Set up the Flask environment for the backend"},
                            {
                                "name": "Design the layout",
                                "subtasks": [
                                    {"name": "Create the HTML template", "subtasks": []}
                                ],
                            },
                        ],
                    },
                    {"name": "CS162 PCW", "subtasks": []},
                ],
            },
            {
                "title": "SS111",
                "tasks": [
                    {"name": "SS111 PCW", "subtasks": []},
                    {
                        "name": "SS111 LBA",
                        "subtasks": [
                            {"name": "Write the introduction", "subtasks": []}
                        ],
                    },
                ],
            },
        ],
    }

    # Render the 'index.html' template with the mock data
    return render_template(
        "home.html", user=user, user_lists=user_lists, current_list=current_list
    )


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(
            "Login requested for user {}, remember_me={}".format(
                form.username.data, form.remember_me.data
            )
        )
        return redirect(url_for("home"))
    return render_template("register.html", title="Register", form=form)


if __name__ == "__main__":
    app.run(debug=True)

from datetime import date
from typing import List, Optional, Set

import sqlalchemy as sa  # database functions
import sqlalchemy.orm as so
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from backend.app import db, login_manager


@login_manager.user_loader
def load_user(id):
    return db.session.get(User, user_id)


class User(UserMixin, db.Model):
    """
    A user who can create and manage task lists.

    Attributes:
    - id: int, primary key
    - username: str, unique, 32 characters
    - password_hash: str, 128 characters

    Relationships:
    - Can have multiple task lists
    """

    __tablename__ = "users"

    id: so.Mapped[int] = so.mapped_column(primary_key=True, autoincrement=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    password_hash: so.Mapped[str] = so.mapped_column(sa.String(128))

    task_lists: so.WriteOnlyMapped[List["TaskList"]] = so.relationship(
        back_populates="user"
    )

    def __init__(self, username: str, password: str):
        """Create a new user with a username and password."""
        self.username = username
        self.set_password(password)

    def is_password_correct(self, password: str) -> bool:
        """Check if the password is valid."""
        return check_password_hash(self.password_hash, password)

    def set_password(self, password: str) -> None:
        """Set the user's password."""
        self.password_hash = generate_password_hash(password)


class TaskList(db.Model):
    """
    A list of tasks that a user can create and manage.

    Attributes:
    - id: int, primary key
    - name: str, 100 characters
    - user_id: int, foreign key

    Relationships:
    - Belongs to a user
    - Contains sections and tasks
    """

    __tablename__ = "task_lists"

    id: so.Mapped[int] = so.mapped_column(primary_key=True, autoincrement=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100), index=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("users.id"))

    user: so.Mapped["User"] = so.relationship(back_populates="task_lists")
    tasks: so.Mapped[List["Task"]] = so.relationship(
        back_populates="task_list"  # refer to the attr "task_list" in the Task class
    )

    def to_dict(self):
        """Add top-level tasks to the list"""
        # Trigger loading of tasks if they are lazy-loaded
        sections = (
            self.sections.all() if hasattr(self.sections, "all") else self.sections
        )

        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "sections": [section.to_dict() for section in sections],
        }


class Task(db.Model):
    """Task model for the database with:
    - id: int, primary key
    - name: str, 100 characters
    - due_date: date
    - is_completed: bool
    - list_id: int, foreign key

    Relationships:
    - Falls under task list
    - Can have subtasks
    - Can have a parent task
    """

    __tablename__ = "tasks"

    id: so.Mapped[int] = so.mapped_column(primary_key=True, autoincrement=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))

    due_date: so.Mapped[str] = so.mapped_column(
        sa.String, default=sa.func.current_date(type_=sa.String)
    )
    is_completed: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    parent_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.ForeignKey("tasks.id"), nullable=True
    )
    depth: so.Mapped[int] = so.mapped_column(default=0)
    list_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("task_lists.id"))

    task_list: so.Mapped["TaskList"] = so.relationship(back_populates="tasks")

    # self-referential relationship to create a tree of tasks
    subtasks: so.Mapped[List["Task"]] = so.relationship(
        backref=so.backref("parent", remote_side=[id]),
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "due_date": self.due_date,
            "is_completed": self.is_completed,
            "parent_id": self.parent_id,
            "list_id": self.list_id,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
        }

    def calculate_depth(self):
        if self.parent_id is None:
            return 0
        else:
            return self.parent.calculate_depth() + 1

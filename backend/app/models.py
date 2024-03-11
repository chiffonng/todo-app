from datetime import date
from typing import List, Optional, Set

import sqlalchemy as sa  # database functions
import sqlalchemy.orm as so
from sqlalchemy.ext.hybrid import hybrid_property
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash

from backend.app import db


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

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
        }


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
    name: so.Mapped[str] = so.mapped_column(sa.String(100), index=True, unique=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.Integer, sa.ForeignKey("users.id"))

    user: so.Mapped["User"] = so.relationship(back_populates="task_lists")
    tasks: so.Mapped[List["Task"]] = so.relationship(
        back_populates="task_list"  # refer to the attr "task_list" in the Task class
    )

    def to_dict(self):
        """Convert the task list to a dictionary."""

        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "tasks": [task.to_dict() for task in self.tasks],
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
    is_completed: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    parent_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.ForeignKey("tasks.id"), nullable=True
    )
    depth: so.Mapped[int] = so.mapped_column(default=0)
    list_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("task_lists.id"))

    task_list: so.Mapped["TaskList"] = so.relationship(back_populates="tasks")

    # self-referential relationship to create a tree of tasks
    # delete subtasks when a task is deleted
    subtasks: so.Mapped[List["Task"]] = so.relationship(
        backref=so.backref("parent", remote_side=[id]),
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "is_completed": self.is_completed,
            "parent_id": self.parent_id,
            "list_id": self.list_id,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
        }

    def calculate_depth(self):
        """Calculate the depth of the task in the tree. A top-level task has a depth of 0."""
        if self.parent_id is None:
            return 0
        else:
            return self.parent.calculate_depth() + 1

    def mark_completed(self):
        """Mark a task as completed and recursively mark its subtasks as completed."""
        self.is_completed = True
        for subtask in self.subtasks:
            subtask.mark_completed()

    def is_descendant_of(self, potential_parent):
        """Check if a task is a descendant of another task."""
        current = self.parent
        while current:
            if current.id == potential_parent.id:
                return True
            current = current.parent
        return False

    def move_to_parent(self, new_parent):
        """Move a task to a new parent task.
        Recalculate the depth of the task and its subtasks.
        """
        if self.is_descendant_of(new_parent):
            raise ValueError("Cannot move a task under its descendant.")
        self.parent = new_parent
        self.calculate_depth()

    def move_to_list(self, new_list_id):
        """Recursively move a task and its subtasks to a new list."""
        self.list_id = new_list_id
        self.parent_id = None
        self.depth = 0
        for subtask in self.subtasks:
            subtask.move_to_list(new_list_id)

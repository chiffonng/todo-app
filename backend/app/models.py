from datetime import date
from typing import List, Optional, Set

import sqlalchemy as sa  # database functions
import sqlalchemy.orm as so
from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property

from . import db, login_manager


@login_manager.user_loader
def load_user(id):
    return db.session.get(User, user_id)


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    email: so.Mapped[Optional[str]] = so.mapped_column(
        sa.String(50), index=True, unique=True
    )
    password_hash: so.Mapped[str] = so.mapped_column(sa.String(128))

    task_lists: so.WriteOnlyMapped[List["TaskList"]] = so.relationship(
        back_populates="user"
    )


class TaskList(db.Model):
    __tablename__ = "task_lists"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("users.id"))

    sections: so.Mapped[List["Section"]] = so.relationship(back_populates="task_lists")
    user: so.Mapped["User"] = so.relationship(back_populates="task_lists")

    def __repr__(self):
        return f"List('{self.name}')"

    def to_dict(self):
        tasks = []

        # add top-level tasks to the list
        for task in self.tasks:
            if task.parent_id is None:
                tasks.append(task.to_dict())

        return {
            "id": self.id,
            "name": self.name,
            "tasks": tasks,
        }


class Section(db.Model):
    __tablename__ = "sections"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    list_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("task_lists.id"))

    tasks: so.WriteOnlyMapped[List["Task"]] = so.relationship(back_populates="sections")
    task_list: so.Mapped["TaskList"] = so.relationship(back_populates="sections")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tasks": [task.to_dict() for task in self.tasks],
        }


class Task(db.Model):
    __tablename__ = "tasks"

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))

    date: so.Mapped[date] = so.mapped_column(sa.Date, default=sa.func.current_date())
    is_completed: so.Mapped[bool] = so.mapped_column(sa.Boolean, default=False)
    parent_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.ForeignKey("tasks.id"), nullable=True
    )
    depth: so.Mapped[int] = so.mapped_column(default=0)

    section_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("sections.id"))
    list_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("task_lists.id"))

    section: so.Mapped["Section"] = so.relationship(back_populates="tasks")

    # self-referential relationship to create a tree of tasks
    subtasks: so.WriteOnlyMapped[List["Task"]] = so.relationship(
        backref=so.backref("parent", remote_side=[id]),
        lazy="selectin",
        cascade="all, delete-orphan",
    )

    @hybrid_property
    def date(self):
        return self._date

    @date.setter
    def date(self, value):
        if isinstance(value, str):
            self._date = datetime.strptime(value, "%Y-%m-%d")
        else:
            self._date = value

    def __repr__(self):
        return f"<Task {self.name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "date": self.date,
            "is_completed": self.is_completed,
            "parent_id": self.parent_id,
            "section_id": self.section_id,
            "list_id": self.list_id,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
        }

    def calculate_depth(self):
        if self.parent_id is None:
            return 0
        else:
            return self.parent.calculate_depth() + 1

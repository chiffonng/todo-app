from typing import Optional

from flask_login import UserMixin
import sqlalchemy as sa  # database functions
import sqlalchemy.orm as so  # support for models
from werkzeug.security import generate_password_hash, check_password_hash

from app import db, login


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(32), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(128))

    lists: so.WriteOnlyMapped["TaskList"] = so.relationship(
        "TaskList", back_populates="user"
    )

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class TaskList(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("User.id"))

    sections: so.Mapped["Section"] = so.relationship(
        "Section", back_populates="task_list"
    )
    user: so.Mapped["User"] = so.relationship("User", back_populates="lists")


class Section(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    list_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("TaskList.id"))

    tasks: so.WriteOnlyMapped["Task"] = so.relationship(
        "Task", back_populates="section"
    )
    task_list: so.Mapped["TaskList"] = so.relationship(
        "TaskList", back_populates="sections"
    )


class Task(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    date: so.Mapped[sa.Date] = so.mapped_column(sa.Date, default=sa.func.now())
    completed: so.Mapped[bool] = so.mapped_column(sa.Boolean)
    parent_id: so.Mapped[Optional[int]] = so.mapped_column(
        sa.ForeignKey("Task.id"), nullable=True
    )
    section_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("Section.id"))

    children: so.WriteOnlyMapped["Task"] = so.relationship(
        "Task", backref=so.backref("parent_id", remote_side=[id])
    )
    section: so.Mapped["Section"] = so.relationship("Section", back_populates="tasks")

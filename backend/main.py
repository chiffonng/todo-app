import sqlalchemy as sa

from app import app, db
from app.models.models import User, TaskList, Section, Task


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "TaskList": TaskList,
        "Section": Section,
        "Task": Task,
    }

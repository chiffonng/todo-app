import sqlalchemy as sa

from backend.app import create_app, db
from backend.app.models import User, TaskList, Section, Task

app = create_app()

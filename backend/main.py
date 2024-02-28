import sqlalchemy as sa

from app import create_app, db
from app.models import User, TaskList, Section, Task

app = create_app()

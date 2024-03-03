import sqlalchemy as sa

from backend.app import create_app, db
from backend.app.models import User, TaskList, Task

app = create_app()

from typing import Tuple

from flask_login import login_required, current_user
from flask_restx import Resource, fields

from . import db, api
from .models import Task
from .uri import (
    TASKS_ENDPOINT,
    GET_TASK_ENDPOINT,
    GET_SUBTASKS_ENDPOINT,
    UPDATE_TASK_STATUS_ENDPOINT,
    CREATE_TASK_ENDPOINT,
    CREATE_SUBTASK_ENDPOINT,
    DELETE_TASK_ENDPOINT,
    EDIT_TASK_ENDPOINT,
    MOVE_TASK_ENDPOINT,
)

task_ns = api.namespace("tasks", description="Task operations", path=TASKS_ENDPOINT)

# Structure output data (GET) and documents the API in Swagger
task_model = task_ns.model(
    "Task",
    {
        "id": fields.Integer(required=True, description="Task ID"),
        "name": fields.String(required=True, description="Task name", max_length=100),
        "due_date": fields.String(
            description="Due date of the task", allow_null=True
        ),  # Assuming date as string for simplicity
        "is_completed": fields.Boolean(
            required=True, description="Task completion status", default=False
        ),
        "list_id": fields.Integer(
            required=True, description="List ID associated with the task"
        ),
        "parent_id": fields.Integer(description="Parent task ID", allow_null=True),
    },
)
task_model_with_subtasks = task_ns.inherit(
    "Task with subtasks",
    task_model,
    {"subtasks": fields.List(fields.Nested(task_model), description="Subtasks")},
)

# validates and parses input data (POST/PUT)
task_parser = task_ns.parser()
task_parser.add_argument("name", required=True, type=str, help="Name of the task")
task_parser.add_argument("parent_id", type=int, help="Parent task ID", required=False)
task_parser.add_argument(
    "list_id", required=True, type=int, help="List ID for the task"
)


@task_ns.route(GET_TASK_ENDPOINT)
class GetTask(Resource):
    @login_required
    @task_ns.marshal_with(task_model, code=200)
    @task_ns.response(404, "Task not found")
    def get(self, task_id: int):
        """Get a specific task by its ID."""
        task = db.session.get(Task, task_id)
        if not task:
            task_ns.abort(404, description="Task not found")
        return task.to_dict()


@task_ns.route(GET_SUBTASKS_ENDPOINT)
class GetSubtasks(Resource):
    @login_required
    @task_ns.marshal_with(task_model, code=200, as_list=True)
    @task_ns.response(200, "Success", [task_model])
    @task_ns.response(404, "Task not found")
    def get(self, task_id: int):
        """Get immediate subtasks of a task."""
        task = db.session.get(Task, task_id)
        if not task:
            task_ns.abort(404, description="Task not found")

        subtasks = task.subtasks
        return {
            "message": f"Successfully retrieved subtasks from task with id {task_id}.",
            "subtasks": [subtask.to_dict() for subtask in subtasks],
        }, 200


@task_ns.route(CREATE_TASK_ENDPOINT)
class CreateTask(Resource):
    @login_required
    @task_ns.expect(task_parser)  # Using task_parser for input validation
    @task_ns.marshal_with(task_model, code=201)  # Marshalling the response
    @task_ns.response(201, "Created a new task")
    @task_ns.response(500, "Failed to create task")
    @task_ns.response(400, "Invalid input")
    def post(self):
        """Create a new top-level task."""
        args = task_parser.parse_args()
        name = args["name"]
        list_id = args["list_id"]

        try:
            new_task = Task(name=name, user_id=current_user.id, list_id=list_id)
            db.session.add(new_task)
            db.session.commit()
            return new_task.to_dict(), 201

        except Exception as e:
            db.session.rollback()
            task_ns.abort(500, f"Failed to create task. Error: {str(e)}")


@task_ns.route(CREATE_SUBTASK_ENDPOINT)
class CreateSubtask(Resource):
    @login_required
    @task_ns.expect(
        task_parser
    )  # You can use the same parser or define a new one for subtasks
    @task_ns.marshal_with(task_model, code=201)  # Marshalling the response
    @task_ns.response(201, "Created a new subtask")
    @task_ns.response(404, "Parent task not found")
    @task_ns.response(500, "Failed to create subtask")
    def post(self, parent_id: int):
        """Create a subtask for a specific parent task."""
        args = task_parser.parse_args()
        name = args["name"]
        list_id = args["list_id"]

        parent_task = db.session.get(Task, parent_id)
        if not parent_task:
            task_ns.abort(404, f"Parent task ID {parent_id} not found")

        try:
            new_subtask = Task(
                name=name, user_id=current_user.id, list_id=list_id, parent_id=parent_id
            )
            db.session.add(new_subtask)
            db.session.commit()
            return new_subtask.to_dict(), 201

        except Exception as e:
            db.session.rollback()
            task_ns.abort(500, f"Failed to create subtask. Error: {str(e)}")


@task_ns.route(DELETE_TASK_ENDPOINT)
class DeleteTask(Resource):
    @login_required
    @task_ns.doc("delete_task", id="delete_task")
    @task_ns.response(200, "Successfully deleted task")
    @task_ns.response(404, "Task not found")
    @task_ns.response(500, "Failed to delete task")
    def delete(self, task_id: int):
        """Delete a specific task by its ID"""
        try:
            task = db.session.get(Task, task_id)
            if not task:
                task_ns.abort(404, f"Task with id {task_id} not found.")

            db.session.delete(task)
            db.session.commit()
            return {"message": f"Successfully deleted task with id {task_id}."}, 200

        except Exception as e:
            db.session.rollback()
            task_ns.abort(
                500,
                f"Failed to delete task with id {task_id}. Error: {str(e)}",
            )


@task_ns.route(EDIT_TASK_ENDPOINT)
class EditTask(Resource):
    @login_required
    @task_ns.expect(task_parser)
    @task_ns.marshal_with(task_model, skip_none=True)
    @task_ns.response(200, "Successfully updated task")
    @task_ns.response(404, "Task not found")
    @task_ns.response(500, "Failed to update task")
    def put(self, task_id: int):
        """Edit a specific task by its ID. Possible changes include name and date."""
        args = task_parser.parse_args()
        try:
            task = db.session.get(Task, task_id)
            if not task:
                task_ns.abort(404, f"Task with id {task_id} not found.")

            task.name = args.get("name", task.name)
            task.due_date = args.get("due_date", task.due_date)

            db.session.commit()
            return task.to_dict(), 200

        except Exception as e:
            db.session.rollback()
            task_ns.abort(
                500, f"Failed to update task with id {task_id}. Error: {str(e)}"
            )


move_task_parser = task_ns.parser()
move_task_parser.add_argument(
    "new_list_id", required=True, type=int, help="New List ID for the task"
)


@task_ns.route(MOVE_TASK_ENDPOINT)
class MoveTask(Resource):
    @login_required
    @task_ns.doc("move_task", description="Drag and drop a task to a different list")
    @task_ns.expect(move_task_parser)
    @task_ns.response(200, "Task successfully moved")
    @task_ns.response(404, "Task not found")
    @task_ns.response(400, "New list ID not found")
    @task_ns.response(500, "Failed to move the task")
    def put(self, task_id: int):
        """Drag and drop a task to a different list"""
        args = move_task_parser.parse_args()
        new_list_id = args.get("new_list_id")

        try:
            task = db.session.get(Task, task_id)
            if not task:
                task_ns.abort(404, f"Task with id {task_id} not found.")

            if not new_list_id:
                task_ns.abort(400, f"New list ID {new_list_id} not found.")

            task.list_id = new_list_id
            db.session.commit()

            return {"message": f"Task ID {task_id} moved to list ID {new_list_id}"}, 200

        except Exception as e:
            db.session.rollback()
            task_ns.abort(500, f"Failed to move the task ID {task_id}. Error: {str(e)}")


def update_subtasks_status(task: Task, new_status: bool = True) -> None:
    """Top-down: If a task is marked as completed, mark all subtasks as done."""
    for subtask in task.subtasks:
        subtask.is_completed = new_status
        update_subtasks_status(subtask, new_status)


def update_parent_status(task: Task) -> None:
    """Bottom-up: If all subtasks of a parent task are marked done, mark the parent task as done."""

    while task.parent_id is not None:
        parent_task = db.session.get(Task, task.parent_id)
        all_completed = all(sibling.is_completed for sibling in parent_task.subtasks)

        if all_completed:
            parent_task.is_completed = True
        else:
            # If any sibling is not completed, don't change the parent status
            break

        # Move up the hierarchy
        task = parent_task


@task_ns.route(UPDATE_TASK_STATUS_ENDPOINT)
class UpdateTaskStatus(Resource):
    @login_required
    @task_ns.doc(
        "update_task_status", description="Update the status of a specific task"
    )
    @task_ns.response(200, "Successfully updated task status")
    @task_ns.response(404, "Task not found")
    @task_ns.response(400, "Invalid task ID")
    @task_ns.response(500, "Failed to update task status")
    def put(self, task_id: int):
        """Update the status of a specific task by its ID."""
        try:
            task = db.session.get(Task, task_id)
            if not task:
                task_ns.abort(404, f"Task with id {task_id} not found")

            new_status = not task.is_completed
            task.is_completed = new_status

            # Update all subtasks if the task is marked as complete/incomplete
            update_subtasks_status(task, new_status)

            # Commit the status change of the task and its subtasks
            db.session.commit()

            # Update parent status based on the status of siblings
            update_parent_status(task)

            # Commit any changes made by updating the parent status
            db.session.commit()

            return {
                "message": f"Successfully updated status of task ID {task_id}.",
                "task": task.to_dict(),
            }, 200

        except Exception as e:
            db.session.rollback()
            task_ns.abort(
                500,
                f"Failed to update status of task ID {task_id}. Error: {str(e)}",
            )

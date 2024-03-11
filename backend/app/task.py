from typing import Tuple

from flask_login import login_required, current_user
from flask_restx import Resource, fields
from sqlalchemy.exc import IntegrityError

from . import db, api
from .models import Task, TaskList
from .uri import (
    TASKS_ENDPOINT,
    GET_TASKS_ENDPOINT,
    GET_TASK_ENDPOINT,
    GET_SUBTASKS_ENDPOINT,
    UPDATE_TASK_STATUS_ENDPOINT,
    CREATE_TASK_ENDPOINT,
    CREATE_SUBTASK_ENDPOINT,
    DELETE_TASK_ENDPOINT,
    EDIT_TASK_ENDPOINT,
    TASK_MOVE_LIST_ENDPOINT,
    TASK_MOVE_PARENT_ENDPOINT,
)
from .utils import standardize_response

task_ns = api.namespace(
    "tasks",
    description="Task operations (Requires user authentication)",
    path=TASKS_ENDPOINT,
)

# Structure output data (GET) and documents the API in Swagger
task_model = task_ns.model(
    "Task",
    {
        "id": fields.Integer(required=True, index=True, description="Task ID"),
        "name": fields.String(required=True, description="Task name", max_length=100),
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


@task_ns.route(GET_TASKS_ENDPOINT)
class GetTasks(Resource):
    @login_required
    # @task_ns.marshal_with(task_model, as_list=True)
    @task_ns.response(200, "Successfully retrieved tasks")
    @task_ns.response(404, "List not found")
    def get(self, list_id: int):
        """Get all top-level tasks from a specific list."""
        task_list = db.session.get(TaskList, list_id)
        if not task_list:
            return standardize_response(f"List with id {list_id} not found.", 404)

        tasks = (
            db.session.execute(db.select(Task).filter_by(list_id=list_id))
            .scalars()
            .all()
        )
        return standardize_response(
            f"Successfully retrieved tasks from list with id {list_id}.",
            200,
            [task.to_dict() for task in tasks],
        )


@task_ns.route(GET_TASK_ENDPOINT)
class GetTask(Resource):
    @login_required
    # @task_ns.marshal_with(task_model, code=200)
    @task_ns.response(404, "Task not found")
    def get(self, list_id: int, task_id: int):
        """Get a specific task by its ID."""
        task_list = db.session.get(TaskList, list_id)
        if not task_list:
            return standardize_response(f"List ID {list_id} not found.", 404)

        task = db.session.get(Task, task_id)
        if not task:
            return standardize_response(f"Task ID {task_id} not found.", 404)
        return standardize_response(
            f"Successfully retrieved task ID {task_id}.", 200, task.to_dict()
        )


@task_ns.route(GET_SUBTASKS_ENDPOINT)
class GetSubtasks(Resource):
    @login_required
    # @task_ns.marshal_with(task_model, code=200, as_list=True)
    @task_ns.response(200, "Success", [task_model])
    @task_ns.response(404, "Task not found")
    def get(self, task_id: int):
        """Get immediate subtasks of a task."""
        task = db.session.get(Task, id=task_id)
        if not task:
            task_ns.abort(404, description="Task not found")

        subtasks = task.subtasks
        return {
            "message": f"Successfully retrieved subtasks from task with id {task_id}.",
            "subtasks": [subtask.to_dict() for subtask in subtasks],
        }, 200


def create_task(name: str, list_id: int, parent_id: int = None):
    new_task = Task(name=name, list_id=list_id, parent_id=parent_id)

    # Ensure no other task with the same name exists in the list
    task_exists = db.session.execute(
        db.select(Task)
        .where(Task.name == name)
        .where(Task.list_id == list_id)
        .where(Task.id != new_task.id)
    ).scalar_one_or_none()

    if task_exists:
        return standardize_response(
            f"Task with name '{name}' already exists in list ID {list_id}",
            400,
        )

    db.session.add(new_task)
    db.session.flush()  # assign ID to the new task but not commit the transaction

    # Calculate the depth of the new task
    new_task.depth = new_task.calculate_depth()

    db.session.commit()

    return standardize_response(
        f"Successfully created task '{name}' in list ID {list_id}",
        201,
        new_task.to_dict(),
    )


@task_ns.route(CREATE_TASK_ENDPOINT)
class CreateTask(Resource):
    @login_required
    @task_ns.expect(task_parser)
    @task_ns.response(201, "Created a new task")
    @task_ns.response(500, "Failed to create task")
    @task_ns.response(400, "Task already exists in the list")
    def post(self, list_id: int) -> Tuple[dict, int]:
        """Create a new top-level task."""
        args = task_parser.parse_args()
        name = args["name"]

        try:
            return create_task(name, list_id)
        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to create task. Error: {str(e)}", 500)


@task_ns.route(CREATE_SUBTASK_ENDPOINT)
class CreateSubtask(Resource):
    @login_required
    @task_ns.expect(task_parser)
    @task_ns.response(201, "Created a new subtask")
    @task_ns.response(400, "Task already exists in the list")
    @task_ns.response(404, "Path not found")
    @task_ns.response(500, "Failed to create subtask")
    def post(self, list_id: int, parent_id: int):
        """Create a subtask for a specific parent task."""
        args = task_parser.parse_args()
        name = args["name"]

        parent_task = db.session.get(Task, parent_id)
        if not parent_task:
            return standardize_response("Path not found", 404)

        try:
            return create_task(name, list_id, parent_id)
        except Exception as e:
            db.session.rollback()
            return standardize_response(
                f"Failed to create subtask. Error: {str(e)}", 500
            )


def delete_task_and_subtasks(task_id: int):
    task = db.session.get(Task, task_id)
    if not task:
        return False, f"Task with id {task_id} not found."

    for subtask in task.subtasks:
        success, message = delete_task_and_subtasks(subtask.id)
        if not success:
            return False, message

    db.session.delete(task)
    return True, f"Successfully deleted task with id {task_id}."


@task_ns.route(DELETE_TASK_ENDPOINT)
class DeleteTask(Resource):
    @login_required
    @task_ns.response(200, "Successfully deleted task")
    @task_ns.response(404, "Task not found")
    @task_ns.response(500, "Failed to delete task")
    def delete(self, list_id: int, task_id: int):
        """Delete a specific task by its ID"""

        try:
            success, message = delete_task_and_subtasks(task_id)
            if not success:
                return standardize_response(message, 404)

            db.session.commit()
            return standardize_response(message, 200)

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to delete task. Error: {str(e)}", 500)


@task_ns.route(EDIT_TASK_ENDPOINT)
class EditTask(Resource):
    @login_required
    @task_ns.expect(task_parser)
    # @task_ns.marshal_with(task_model, skip_none=True)
    @task_ns.response(200, "Successfully updated task name")
    @task_ns.response(400, "Task name already exists in the list")
    @task_ns.response(404, "Task not found")
    @task_ns.response(500, "Failed to edit task name")
    def put(self, list_id: int, task_id: int):
        """Update task name."""

        task_list = db.session.get(TaskList, list_id)
        if not task_list:
            return standardize_response(f"List with ID {list_id} not found.", 404)

        try:
            task = db.session.get(Task, task_id)
            if not task:
                task_ns.abort(404, f"Task with id {task_id} not found.")

            args = task_parser.parse_args()
            new_name = args["name"]

            # Check if task with the same name already exists, but not the current task
            task_exists = db.session.execute(
                db.select(Task)
                .where(Task.user_id == current_user.id)
                .where(Task.id != task_id)
                .where(Task.name == new_name)
            ).scalar_one_or_none()

            if task_exists:
                return standardize_response(
                    f"Task with name '{name}' already exists.", 400
                )

            db.session.commit()

            return standardize_response(
                f"Successfully updated task ID {task_id} to name '{name}'.",
                200,
                task.to_dict(),
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to update task. Error: {e}", 500)


list_migration_parser = task_ns.parser()
list_migration_parser.add_argument(
    "new_list_id", required=True, type=int, help="New List ID"
)

parent_migration_parser = task_ns.parser()
parent_migration_parser.add_argument(
    "new_parent_id", type=int, help="New Parent ID", default=None
)


@task_ns.route(TASK_MOVE_PARENT_ENDPOINT)
class MoveTaskToNewParent(Resource):
    @login_required
    @task_ns.expect(parent_migration_parser)
    @task_ns.response(200, "Task successfully moved")
    @task_ns.response(400, "Invalid new parent")
    @task_ns.response(404, "Task or new parent not found")
    @task_ns.response(500, "Failed to move the task")
    def put(self, task_id: int):
        """Move a task to a new parent"""
        args = parent_migration_parser.parse_args()
        new_parent_id = args.get("new_parent_id")

        # Check if the task exists
        task = db.session.get(Task, task_id)
        if not task:
            return standardize_response(f"Task with ID {task_id} not found.", 404)

        try:
            # Check if the new parent exists
            new_parent = db.session.get(Task, new_parent_id)
            if not new_parent:
                return standardize_response(
                    f"New parent with ID {new_parent_id} not found.", 404
                )

            # Check for circular references
            if task.is_descendant_of(new_parent):
                return standardize_response(
                    "The new parent cannot be a descendant of the task.", 400
                )

            task.move_to_parent(new_parent)
            db.session.commit()

            return standardize_response(
                f"Successfully moved the task and its subtasks to new parent with ID {new_parent_id}.",
                200,
                task.to_dict(),
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(
                f"Failed to move the task. Error: {str(e)}", 500
            )


@task_ns.route(TASK_MOVE_LIST_ENDPOINT)
class MoveTaskToNewList(Resource):
    @login_required
    @task_ns.expect(list_migration_parser)
    @task_ns.response(200, "Task successfully moved")
    @task_ns.response(404, "List ID or task ID not found")
    @task_ns.response(400, "Invalid new list ID")
    @task_ns.response(500, "Failed to move the task")
    def put(self, list_id: int, task_id: int):
        """Move a task and its descendents to a new list."""
        args = list_migration_parser.parse_args()
        new_list_id = args.get("new_list_id")

        # Check if the current list exists
        current_list = db.session.get(TaskList, list_id)
        if not current_list:
            return standardize_response(f"List with ID {list_id} not found.", 404)

        # Check if the task exists
        task = db.session.get(Task, task_id)
        if not task:
            return standardize_response(f"Task with ID {task_id} not found.", 404)

        try:
            # Check if the new list exists
            new_list = db.session.get(TaskList, new_list_id)
            if not new_list:
                return standardize_response(
                    f"New list with ID {new_list_id} not found.", 404
                )

            # Check that the new list is not the same as the current list
            if new_list_id == list_id:
                return standardize_response("The task stays in the list", 400)

            # The task becomes a top-level task and has no parent
            task.move_to_parent(None)

            # Move the task and its subtasks to the new list
            task.move_to_list(new_list_id)
            db.session.commit()

            return standardize_response(
                f"Successfully moved the task and its subtasks from list '{current_list.name}' to '{new_list.name}'.",
                200,
                task.to_dict(),
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(
                f"Failed to move the task. Error: {str(e)}", 500
            )


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
    @task_ns.response(200, "Successfully updated task status")
    @task_ns.response(404, "Task not found")
    @task_ns.response(400, "Invalid task ID")
    @task_ns.response(500, "Failed to update task status")
    def put(self, list_id: int, task_id: int):
        """Update the status of a specific task by its ID."""

        try:
            task = db.session.get(Task, task_id)
            if not task:
                return standardize_response(f"Task with ID {task_id} not found.", 404)

            new_status = not task.is_completed
            task.is_completed = new_status

            # Update all subtasks if the task is marked as complete/incomplete
            update_subtasks_status(task, new_status)

            # Update parent status based on the status of siblings
            update_parent_status(task)

            db.session.commit()

            return standardize_response(
                f"Successfully updated status of task ID {task_id}.", 200
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(
                f"Failed to update task status. Error: {str(e)}", 500
            )

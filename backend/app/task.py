from typing import Tuple

from flask import Blueprint, Response, abort, jsonify, request
from flask_login import login_required

from . import db
from .models import Task

task_bp = Blueprint("task", __name__)


@task_bp.route("/task/<int:task_id>", methods=["GET"])
@login_required
def get_task(task_id: int) -> Response:
    """Get a specific task by its ID."""

    task = db.session.get(task_id)
    if not task:
        abort(404, description="Task not found")
    return jsonify(task.to_dict())


@task_bp.route("/task/<int:task_id>/subtasks", methods=["GET"])
@login_required
def get_subtasks(task_id: int) -> Response:
    """Get immediate subtasks of a task."""

    task = db.session.get(Task, task_id)
    if not task:
        abort(404, description="Task not found")

    sorted_subtasks = sorted(task.subtasks, key=lambda x: x.date)

    try:
        return jsonify(
            {
                "message": f"Successfully retrieved subtasks from task with id {task_id}.",
                "subtasks": [subtask.to_dict() for subtask in sorted_subtasks],
            }
        )
    except Exception as e:
        return jsonify(
            {
                "message": f"Failed to retrieve subtasks from task with id {task_id}",
                "error": e,
            }
        )


@task_bp.route("/task/", methods=["POST"])
@login_required
def create_task() -> Tuple[Response, int]:
    """Create a new task."""

    try:
        name = request.json.get("name")
        list_id = request.json.get("list_id")
        task = Task(name=name, list_id=list_id)

        db.session.add(task)
        db.session.commit()
        return jsonify(new_task.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create task", "message": str(e)}), 500


@task_bp.route("/task/<int:parent_id>/subtasks", methods=["POST"])
@login_required
def create_subtask(parent_id):
    parent_task = db.session.get(Task, parent_id)
    if not parent_task:
        return jsonify({"error": "Parent task not found"}), 404

    try:

        parent_task.task_depth = parent_task.calculate_depth()
        name = request.json.get("name")

        new_subtask = Task(
            name=name,
            list_id=parent_task.list_id,
            parent_id=parent_task.id,
            depth=parent_task.depth + 1,
        )
        db.session.add(new_subtask)
        db.session.commit()

        return jsonify(new_subtask.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create subtask", "message": str(e)}), 500


@task_bp.route("/task/<int:task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id: int) -> Tuple[Response, int]:
    try:
        task = db.session.get(Task, task_id)
        db.session.delete(task)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": f"Successfully deleted task with id {task_id}.",
                    "task": task.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {"message": f"Failed to delete task with id {task_id}", "error": e}
            ),
            400,
        )


@task_bp.route("/task/<int:task_id>", methods=["PUT"])
@login_required
def edit_task(task_id: int) -> Tuple(Response, int):
    """Edt a specific task by its ID. Possible changes include name and date"""
    try:
        name = request.json.get("name")
        date = request.json.get("date")

        task = db.session.get(Task, task_id)
        task.name = name
        task.date = date

        db.session.commit()

        return (
            jsonify(
                {
                    "message": f"Successfully updated task with id {task_id}.",
                    "task": task.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {"message": f"Failed to update task with id {task_id}", "error": e}
            ),
            400,
        )


@task_bp.route("task/<int:task_id>/move", methods=["PUT"])
@login_required
def move_task(task_id: int) -> Tuple[Response, int]:
    """Drag and drop a task to a different list, section, or parent task."""
    try:
        new_list_id = request.json.get("new_list_id")
        task = db.session.get(Task, task_id)
        task.list_id = new_list_id
        db.session.commit()

        return (
            jsonify(
                {"message": f"Moved the task ID {task_id} to list ID {new_list_id}"}
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {"message": f"Failed to move the task ID {task_id}", "error": str(e)}
            ),
            400,
        )


def update_subtasks_status(task: Task, new_status: bool = True) -> None:
    """Top-down: Recursively update the status of subtasks."""
    for subtask in task.subtasks:
        subtask.is_completed = new_status
        update_subtasks_status(subtask, new_status)


def update_parent_status(task: Task):
    """Bottom-up: Recursively update the status of parent tasks based on the status of their children."""

    # If the task has no parent, we're done
    if task.parent_id is None:
        return

    # Fetch the parent task
    parent_task = db.session.get(Task, task.parent_id)

    # Get the status of all siblings
    all_completed = all([sibling.is_completed for sibling in parent_task.subtasks])

    # If all siblings are completed, the parent task is also completed
    if all_completed:
        parent_task.is_completed = True
    else:
        parent_task.is_completed = False

    # Recursively update the parent status of the parent task
    update_parent_status(parent_task)


@task_bp.route("/task/<int:task_id>/status", methods=["PUT"])
@login_required
def update_task_status(task_id: int) -> Tuple[Response, int]:
    """Update the status of a specific task by its ID."""

    try:
        task = db.session.get(Task, task_id)
        new_status = not task.is_completed
        task.is_completed = new_status

        # Update all subtasks if the task is marked as complete/incomplete
        update_subtasks_status(task, new_status)

        # Commit the status change of the task and its subtasks
        db.session.commit()

        # Re-fetch the task to ensure we have the latest data
        task = db.session.get(Task, task_id)

        # Update parent status based on the status of siblings
        update_parent_status(task)

        # Commit any changes made by updating the parent status
        db.session.commit()

        return (
            jsonify(
                {
                    "message": f"Successfully updated status of task with id {task_id}.",
                    "task": task.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to update status of task with id {task_id}",
                    "error": {e},
                }
            ),
            400,
        )


@task_bp.route("/task/<int:task_id>", methods=["PUT"])
@login_required
def edit_task(task_id: int) -> Tuple[Response, int]:
    """Edt a specific task by its ID. Possible changes include:
    - name
    - date
    """
    try:
        name = request.json.get("name")
        date = request.json.get("date")

        task = db.session.get(Task, task_id)
        task.name = name
        task.date = date

        db.session.commit()

        return (
            jsonify(
                {
                    "message": f"Successfully updated task with id {task_id}.",
                    "task": task.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify(
            {"message": f"Failed to update task with id {task_id}. error is {e}"}
        )

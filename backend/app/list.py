from typing import Tuple

from flask import Blueprint, Response, request, jsonify
from flask_login import login_required, current_user

from . import db
from .models import TaskList, Task
from .uri import (
    GET_ALL_LISTS_ENDPOINT,
    GET_LIST_ENDPOINT,
    GET_TASKS_ENDPOINT,
    CREATE_LIST_ENDPOINT,
    DELETE_LIST_ENDPOINT,
    EDIT_LIST_ENDPOINT,
)

list_bp = Blueprint("list", __name__)


@list_bp.route(GET_ALL_LISTS_ENDPOINT, methods=["GET"])
@login_required
def get_all_lists():
    """Get all lists of the current user from the database."""
    try:
        lists = (
            db.session.execute(
                select(TaskList).where(TaskList.user_id == current_user.id)
            )
            .scalars()
            .all()
        )

        return (
            jsonify(
                {
                    "message": "Successfully retrieved all lists from the database",
                    "lists": [
                        {
                            "id": task_list.id,
                            "name": task_list.name,
                        }
                        for task_list in lists
                    ],
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to retrieve all lists from the database.. error is {e}"
                }
            ),
            400,
        )


@list_bp.route(GET_LIST_ENDPOINT, methods=["GET"])
@login_required
def get_list(list_id: int) -> Tuple[Response, int]:
    """Get a specific list by its ID."""

    task_list = db.session.get(TaskList, list_id)
    if not tasklist:
        return jsonify({"error": "Task list not found"}), 404
    try:
        return (
            jsonify(
                {
                    "message": "Successfully retrieved list with id {list_id}.",
                    "list": task_list.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to retrieve list with id {list_id}. ",
                    "error": str(e),
                }
            ),
            400,
        )


@list_bp.route(GET_TASKS_ENDPOINT, methods=["GET"])
@login_required
def get_tasks(list_id: int) -> Tuple[Response, int]:
    """Get all tasks from a specific list"""
    try:
        tasks = db.session.get(TaskList, list_id).tasks

        return (
            jsonify(
                {
                    "message": f"Successfully retrieved all tasks from list with id {list_id}.",
                    "tasks": [task.to_dict() for task in tasks],
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to retrieve all tasks from list ID{list_id}",
                    "error": str(e),
                }
            ),
            400,
        )


@list_bp.route(CREATE_LIST_ENDPOINT, methods=["POST"])
@login_required
def create_list():
    """Create a new task list."""
    try:
        name = request.json.get("name")
        user_id = current_user.id

        task_list = TaskList(name=name, user_id=user_id)
        db.session.add(task_list)
        db.session.commit()

        return (
            jsonify({"message": f"Successfully created a new list with name {name}."}),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": f"Failed to create a new list with name {name}.",
                    "error": str(e),
                }
            ),
            400,
        )


# delete a specific list from the database
@list_bp.route(DELETE_LIST_ENDPOINT, methods=["DELETE"])
@login_required
def delete_list(list_id: int) -> Tuple[Response, int]:
    try:
        task_list = db.session.get(TaskList, list_id)

        if not task_list:
            return (
                jsonify({"message": f"List with id {list_id} not found."}),
                404,
            )

        # check if the list has any tasks and delete them
        tasks = db.session.get(TaskList, list_id).tasks
        for task in tasks:
            db.session.delete(task)

        db.session.delete(task_list)
        db.session.commit()

        return (
            jsonify({"message": f"Successfully deleted the list ID {list_id}."}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"message": f"Failed to delete the list ID {list_id}. Error {e}"}),
            500,
        )


# update a specific list in the database
@list_bp.route(EDIT_LIST_ENDPOINT, methods=["PUT"])
@login_required
def edit_list(list_id: int) -> Tuple[Response, int]:
    """Update list name"""

    try:
        # Retrieve the list that matches the list_id and current user's id
        task_list = db.session.get(TaskList, list_id)

        if not task_list:
            return (
                jsonify({"message": f"List with id {list_id} not found."}),
                404,
            )

        # Get the new name from the request
        name = request.json.get("name")
        task_list.name = name

        db.session.commit()

        return (
            jsonify({"message": f"Successfully updated the list with id {list_id}."}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {"message": f"Failed to update the list with id {list_id}", "error": e}
            ),
            400,
        )

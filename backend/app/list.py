from typing import Tuple

from flask_login import login_required, current_user
from flask_restx import Namespace, Resource, fields

from . import db, api
from .models import TaskList, Task
from .task import task_model, task_model_with_subtasks
from .uri import (
    LISTS_ENDPOINT,
    GET_ALL_LISTS_ENDPOINT,
    GET_LIST_ENDPOINT,
    GET_TASKS_ENDPOINT,
    CREATE_LIST_ENDPOINT,
    DELETE_LIST_ENDPOINT,
    EDIT_LIST_ENDPOINT,
)

list_ns = Namespace("list", description="List operations", path=LISTS_ENDPOINT)

list_model = list_ns.model(
    "Task list",
    {
        "id": fields.Integer(required=True, description="List ID"),
        "name": fields.String(
            required=True, description="List name", min_length=1, max_length=50
        ),
        "user_id": fields.Integer(required=True, description="User ID"),
        "tasks": fields.List(
            fields.Nested(task_model_with_subtasks), description="Tasks", required=False
        ),
    },
)

list_parser = list_ns.parser()
list_parser.add_argument("name", type=str, required=True, help="List name")


@list_ns.route(GET_ALL_LISTS_ENDPOINT)
class GetAllLists(Resource):
    @login_required
    @list_ns.marshal_with(list_model, as_list=True)
    @list_ns.response(200, "Succesfully retrieved all lists")
    @list_ns.response(400, "Failed to retrieve lists")
    def get(self):
        """Get all lists of the current user from the database."""

        try:
            lists = (
                db.session.execute(
                    select(TaskList).where(TaskList.user_id == current_user.id)
                )
                .scalars()  # Convert the result to a list
                .all()  # Get all the results
            )

            return {"lists": [task_list.to_dict() for task_list in lists]}, 200
        except Exception as e:
            task_ns.abort(400, f"Failed to retrieve lists. Error: {e}")


@list_ns.route(GET_LIST_ENDPOINT)
class GetList(Resource):
    @login_required
    @list_ns.marshal_with(list_model)
    @list_ns.response(200, "Successfully retrieved list")
    @list_ns.response(404, "List not found")
    def get(self, list_id: int):
        """Get a specific list by its ID."""
        task_list = db.session.get(TaskList, list_id)
        if not task_list:
            list_ns.abort(404, message="List not found")
        return task_list.to_dict(), 200


@list_ns.route(GET_TASKS_ENDPOINT)
class GetTasks(Resource):
    @login_required
    @list_ns.marshal_with(task_model, as_list=True)
    @list_ns.response(200, "Successfully retrieved tasks")
    @list_ns.response(404, "List not found")
    def get(self, list_id: int):
        """Get all tasks from a specific list."""
        task_list = db.session.get(TaskList, list_id)
        if not task_list:
            list_ns.abort(404, message="List not found")
        tasks = task_list.tasks
        return {"tasks": [task.to_dict() for task in tasks]}, 200


@list_ns.route(CREATE_LIST_ENDPOINT)
class CreateList(Resource):
    @login_required
    @list_ns.expect(list_parser, validate=True)
    @list_ns.response(201, "List created successfully")
    @list_ns.response(500, "Internal server error")
    def post(self):
        """Create a new task list."""
        args = list_parser.parse_args()
        name = args["name"]

        try:
            new_list = TaskList(name=name, user_id=current_user.id)
            db.session.add(new_list)
            db.session.commit()
            return {
                "message": f"Successfully created a new list with name {name}."
            }, 201

        except Exception as e:
            db.session.rollback()
            list_ns.abort(500, f"Failed to create a new list. Error: {e}")


@list_ns.route(DELETE_LIST_ENDPOINT)
class DeleteList(Resource):
    @login_required
    @list_ns.response(200, "List deleted successfully")
    @list_ns.response(404, "List not found")
    @list_ns.response(500, "Internal server error")
    def delete(self, list_id: int):
        """Delete a specific list."""
        try:
            task_list = db.session.get(TaskList, list_id)

            if not task_list:
                list_ns.abort(404, f"List with ID {list_id} not found.")

            db.session.delete(task_list)
            db.session.commit()

            return {"message": f"Successfully deleted list ID {list_id}."}, 200

        except Exception as e:
            db.session.rollback()
            list_ns.abort(500, f"Failed to delete list. Error: {e}")


@list_ns.route(EDIT_LIST_ENDPOINT)
class EditList(Resource):
    @login_required
    @list_ns.expect(list_parser, validate=True)
    @list_ns.response(200, "List updated successfully")
    @list_ns.response(404, "List not found")
    @list_ns.response(500, "Internal server error")
    def put(self, list_id: int):
        """Update list name."""
        args = edit_list_parser.parse_args()
        name = args["name"]

        try:
            task_list = db.session.get(TaskList, list_id)

            if not task_list:
                list_ns.abort(404, f"List with ID {list_id} not found.")

            task_list.name = name
            db.session.commit()

            return {
                "message": f"Successfully updated list ID {list_id} to new name {name}"
            }, 200

        except Exception as e:
            db.session.rollback()
            list_ns.abort(500, f"Server failed to update list. Error: {e}")

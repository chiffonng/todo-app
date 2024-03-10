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
from .utils import standardize_response

list_ns = Namespace(
    "list",
    description="List operations (Requires user authentication)",
    path=LISTS_ENDPOINT,
)

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
    @list_ns.response(200, "Succesfully retrieved all lists")
    @list_ns.response(500, "Failed to retrieve lists")
    def get(self):
        """Get all lists of the current user from the database."""
        try:
            lists = (
                db.session.execute(
                    db.select(TaskList)
                    .filter_by(user_id=current_user.id)
                    .order_by(TaskList.name)
                )
                .scalars()  # Return elements as scalars
                .all()  # Convert the result to a list
            )

            if not lists:
                return standardize_response("No lists found.", 200)
            else:
                return standardize_response(
                    "Successfully retrieved lists.",
                    200,
                    [task_list.to_dict() for task_list in lists],
                )
        except Exception as e:
            return standardize_response(f"Failed to retrieve lists. Error: {e}", 500)


@list_ns.route(GET_LIST_ENDPOINT)
class GetList(Resource):
    @login_required
    @list_ns.response(200, "Successfully retrieved list")
    @list_ns.response(404, "List not found")
    def get(self, list_id: int):
        """Get a specific list by its ID."""
        try:
            task_list = db.session.execute(
                db.select(TaskList).filter_by(id=list_id)
            ).scalar_one_or_none()
            if not task_list:
                return standardize_response(f"List with ID {list_id} not found.", 404)
            else:
                return standardize_response(
                    "Successfully retrieved list.",
                    status_code=200,
                    data=task_list.to_dict(),
                )
        except Exception as e:
            return standardize_response(f"Failed to retrieve list. Error: {e}", 500)


@list_ns.route(CREATE_LIST_ENDPOINT)
class CreateList(Resource):
    @login_required
    @list_ns.expect(list_parser, validate=True)
    @list_ns.response(201, "List created successfully")
    @list_ns.response(400, "List already exists")
    @list_ns.response(500, "Internal server error")
    def post(self):
        """Create a new task list."""
        args = list_parser.parse_args()
        name = args["name"]

        try:
            new_list = TaskList(name=name, user_id=current_user.id)

            list_exists = db.session.execute(
                db.select(TaskList).filter_by(name=name, user_id=current_user.id)
            ).scalar_one_or_none()

            if list_exists:
                return standardize_response(
                    f"List with name {name} already exists.", 400
                )

            db.session.add(new_list)
            db.session.commit()
            return standardize_response(
                "Successfully created list.",
                status_code=201,
                data=new_list.to_dict(),
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to create list. Error: {e}", 500)


@list_ns.route(DELETE_LIST_ENDPOINT)
class DeleteList(Resource):
    @login_required
    @list_ns.response(200, "List deleted successfully")
    @list_ns.response(404, "List not found")
    @list_ns.response(500, "Internal server error")
    def delete(self, list_id: int):
        """Delete a specific list."""
        try:
            task_list = db.session.execute(
                db.select(TaskList).filter_by(id=list_id)
            ).scalar_one_or_none()

            if not task_list:
                return standardize_response(f"List with ID {list_id} not found.", 404)

            db.session.delete(task_list)
            db.session.commit()

            return standardize_response(f"Successfully deleted list ID {list_id}.", 200)

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to delete list. Error: {e}", 500)


@list_ns.route(EDIT_LIST_ENDPOINT)
class EditList(Resource):
    @login_required
    @list_ns.expect(list_parser, validate=True)
    @list_ns.response(200, "List updated successfully")
    @list_ns.response(400, "List already exists")
    @list_ns.response(404, "List not found")
    @list_ns.response(500, "Internal server error")
    def put(self, list_id: int):
        """Update list name."""
        args = list_parser.parse_args()
        name = args["name"]

        try:
            task_list = db.session.execute(
                db.select(TaskList).filter_by(id=list_id)
            ).scalar_one()

            if not task_list:
                return standardize_response(f"List with ID {list_id} not found.", 404)

            task_list.name = name

            list_name_exists = db.session.execute(
                db.select(TaskList).filter_by(name=name, user_id=current_user.id)
            ).scalar_one_or_none()

            if list_name_exists:
                return standardize_response(
                    f"List with name {name} already exists.", 400
                )

            db.session.commit()

            return standardize_response(
                f"Successfully updated list ID {list_id}.", 200, task_list.to_dict()
            )

        except Exception as e:
            db.session.rollback()
            return standardize_response(f"Failed to update list. Error: {e}", 500)

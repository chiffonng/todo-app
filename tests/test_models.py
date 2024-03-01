import pytest

from backend.app.models import User, TaskList, Section, Task

"""Check the logic of models only."""


def test_new_user():
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the username, email, and password_hash fields are defined correctly
    """
    user = User(username="testuser", password="testpassword")

    assert user.username == "testuser"
    # Check that the password is hashed and not the same as the plain password
    assert user.password_hash != "testpassword"
    assert user.is_password_correct("testpassword")


@pytest.fixture
def mock_task():
    task = Task()
    task.id = 1
    task.name = "Test Task"
    task.due_date = "2022-01-01"
    task.is_completed = False
    task.parent_id = None
    task.section_id = 2
    task.list_id = 3
    task.subtasks = []  # Assuming this is a list of Task instances
    return task


def test_new_task(mock_task):
    """
    GIVEN a Task model
    WHEN a new Task is created
    THEN check the name, due_date, and task_list_id fields are defined correctly
    """

    assert mock_task.name == "Test Task"
    assert mock_task.due_date == "2022-01-01"
    assert mock_task.list_id == 3


def test_task_to_dict(mock_task):
    """
    Test the to_dict method of Task class.
    """
    task_dict = mock_task.to_dict()
    assert task_dict["id"] == 1
    assert task_dict["name"] == "Test Task"
    assert task_dict["due_date"] == "2022-01-01"
    assert task_dict["is_completed"] is False
    assert task_dict["parent_id"] is None
    assert task_dict["section_id"] == 2
    assert task_dict["list_id"] == 3
    assert isinstance(task_dict["subtasks"], list)


def test_task_calculate_depth(mock_task):
    """
    Test the calculate_depth method of Task class.
    """
    # Test with no parent
    assert mock_task.calculate_depth() == 0

    # Adding a mock parent task to test depth calculation
    parent_task = Task()
    parent_task.id = 2
    mock_task.parent = parent_task
    mock_task.parent_id = 2

    assert mock_task.calculate_depth() == 1


@pytest.fixture
def mock_section(mock_task):
    section = Section()
    section.id = 2
    section.name = "Test Section"
    section.list_id = 3
    section.tasks = [mock_task]
    return section


def test_new_section(mock_section, mock_task):
    """
    GIVEN a Section model
    WHEN a new Section is created
    THEN check the title and list_id fields are defined correctly
    """
    assert mock_section.id == 2
    assert mock_section.name == "Test Section"
    assert mock_section.list_id == 3
    assert isinstance(mock_section.tasks, list)
    assert mock_section.tasks[0] == mock_task


def test_new_list():
    """
    GIVEN a TaskList model
    WHEN a new TaskList is created
    THEN check the name and user_id fields are defined correctly
    """
    task_list = TaskList(name="testlist", user_id=1)

    assert task_list.name == "testlist"
    assert task_list.user_id == 1

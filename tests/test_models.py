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

    assert hasattr(mock_section, "tasks")
    assert isinstance(mock_section.tasks, list)
    assert len(mock_section.tasks) > 0
    assert mock_section.tasks[0] == mock_task


def test_section_to_dict(mock_section, mock_task):
    """
    Test the to_dict method of Section class.
    """
    section_dict = mock_section.to_dict()
    assert section_dict["id"] == 2
    assert section_dict["name"] == "Test Section"
    assert section_dict["list_id"] == 3

    # Check if the tasks are converted to a list of task dictionaries
    assert isinstance(section_dict["tasks"], list)
    assert section_dict["tasks"][0] == mock_task.to_dict()


@pytest.fixture
def mock_task_list(mock_section):
    task_list = TaskList()
    task_list.id = 3
    task_list.name = "Test List"
    task_list.user_id = 1
    task_list.sections = [mock_section]
    return task_list


def test_new_list(mock_task_list, mock_section, mock_task):
    """
    GIVEN a TaskList model
    WHEN a new TaskList is created
    THEN check the name and user_id fields are defined correctly
    """
    assert mock_task_list.id == 3
    assert mock_task_list.name == "Test List"
    assert mock_task_list.user_id == 1

    assert isinstance(mock_task_list.sections, list)
    assert mock_task_list.sections[0] == mock_section

    assert isinstance(mock_task_list.sections[0].tasks, list)
    assert mock_task_list.sections[0].tasks[0] == mock_task


def test_list_to_dict(mock_task_list, mock_section, mock_task):
    """
    Test the to_dict method of TaskList class.
    """
    list_dict = mock_task_list.to_dict()
    assert list_dict["id"] == 3
    assert list_dict["name"] == "Test List"
    assert list_dict["user_id"] == 1

    # Check if the sections are converted to a list of section dictionaries
    assert "sections" in list_dict
    assert isinstance(list_dict["sections"], list)
    assert len(list_dict["sections"]) > 0
    assert list_dict["sections"][0] == mock_section.to_dict()

    # Check if the tasks are converted to a list of task dictionaries
    assert "tasks" in list_dict["sections"][0]
    assert isinstance(list_dict["sections"][0]["tasks"], list)
    assert len(list_dict["sections"][0]["tasks"]) > 0
    assert list_dict["sections"][0]["tasks"][0] == mock_task.to_dict()

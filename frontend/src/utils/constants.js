export const API_BASE_URL = "http://127.0.0.1:5000/api";
export const SWAGGER_BASE_URL = "http://127.0.0.1:5000/swagger.json";

// Define endpoint paths
export const AUTH_ENDPOINTS = {
	LOGIN: `${API_BASE_URL}/auth/login`,
	LOGOUT: `${API_BASE_URL}/auth/logout`,
	REGISTER: `${API_BASE_URL}/auth/register`,
};

export const LIST_ENDPOINTS = {
	GET_ALL_LISTS: `${API_BASE_URL}/lists/all`,
	GET_LIST: (listId) => `${API_BASE_URL}/lists/${listId}`,
	GET_TASKS: (listId) => `${API_BASE_URL}/lists/${listId}/tasks`,
	CREATE_LIST: `${API_BASE_URL}/lists`,
	EDIT_LIST: (listId) => `${API_BASE_URL}/lists/${listId}/edit`,
	DELETE_LIST: (listId) => `${API_BASE_URL}/lists/${listId}/delete`,
};

export const TASK_ENDPOINTS = {
	GET_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}`,
	CREATE_TASK: (listId) => `${API_BASE_URL}/lists/${listId}/tasks`,
	EDIT_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/edit`,
	MOVE_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/move`,
	UPDATE_TASK_STATUS: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/status`,
	DELETE_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/delete`,
	GET_SUBTASKS: (listId, parentId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${parentId}/`,
	CREATE_SUBTASK: (listId, parentId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${parentId}/subtasks`,
};

// Define action types for context/reducers and API calls
export const ACTIONS = {
	// List actions
	FETCH_LISTS: "FETCH_LISTS",
	ADD_LIST: "ADD_LIST",
	EDIT_LIST: "EDIT_LIST",
	REMOVE_LIST: "REMOVE_LIST",
	FETCH_TASKS: "FETCH_TASKS",
	ADD_TASK: "ADD_TASK",
	EDIT_TASK: "EDIT_TASK",
	MOVE_TASK: "MOVE_TASK",
	REMOVE_TASK: "REMOVE_TASK",
};

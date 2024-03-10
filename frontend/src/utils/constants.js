export const API_BASE_URL = "/api";
export const SWAGGER_BASE_URL = "swagger.json";

// Define endpoint paths
export const AUTH_ENDPOINTS = {
	LOGIN: `${API_BASE_URL}/auth/login`,
	LOGOUT: `${API_BASE_URL}/auth/logout`,
	REGISTER: `${API_BASE_URL}/auth/register`,
};

export const LIST_ENDPOINTS = {
	GET_ALL_LISTS: `${API_BASE_URL}/lists/all`,
	GET_LIST: (listId) => `${API_BASE_URL}/lists/${listId}`,
	CREATE_LIST: `${API_BASE_URL}/lists`,
	EDIT_LIST: (listId) => `${API_BASE_URL}/lists/${listId}/edit`,
	DELETE_LIST: (listId) => `${API_BASE_URL}/lists/${listId}/delete`,
};

export const TASK_ENDPOINTS = {
	GET_ALL_TASKS: (listId) => `${API_BASE_URL}/lists/${listId}/tasks/all`,
	GET_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}`,
	CREATE_TASK: (listId) => `${API_BASE_URL}/lists/${listId}/tasks`,
	EDIT_TASK: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/edit`,
	MOVE_TO_NEW_LIST: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/move-list`,
	MOVE_TO_NEW_PARENT: (listId, taskId) =>
		`${API_BASE_URL}/lists/${listId}/tasks/${taskId}/move-parent`,
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

export const ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",
	MAIN: "/lists/all",
	CURRENT_LIST: (listId) => `/lists/${listId}`,
};

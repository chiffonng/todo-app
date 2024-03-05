export const API_BASE_URL = 'http://localhost:5000/api'; 

// Define endpoint paths
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  SIGNIN: `${API_BASE_URL}/auth/signin`,
  SIGNOUT: `${API_BASE_URL}/auth/signout`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
};


export const LIST_ENDPOINTS = {
  GET_ALL_LISTS: `${API_BASE_URL}/lists/all`,
  GET_LIST: listId => `${API_BASE_URL}/lists/${listId}`,
  GET_TASKS: listId => `${API_BASE_URL}/lists/${listId}/tasks`,
  CREATE_LIST: `${API_BASE_URL}/lists`,
  EDIT_LIST: listId => `${API_BASE_URL}/lists/${listId}`,
  DELETE_LIST: listId => `${API_BASE_URL}/lists/${listId}`,
};

export const TASK_ENDPOINTS = {
  GET_TASK: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}`,
  GET_SUBTASKS: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}/subtasks`,
  CREATE_TASK: listId => `${API_BASE_URL}/lists/${listId}/tasks`,
  CREATE_SUBTASK: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}/subtasks`,
  EDIT_TASK: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}/edit`,
  MOVE_TASK: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}/move`,
  UPDATE_TASK_STATUS: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}`,
  DELETE_TASK: (taskId, listId) => `${API_BASE_URL}/lists/${listId}/tasks/${taskId}`,
};

// Define action types for context/reducers and API calls
export const ACTION_TYPES = {
  // List actions
  FETCH_LISTS: 'FETCH_LISTS',
  ADD_LIST: 'ADD_LIST',
  EDIT_LIST: 'EDIT_LIST',
  REMOVE_LIST: 'REMOVE_LIST',
  FETCH_TASKS: 'FETCH_TASKS',
  ADD_TASK: 'ADD_TASK',
  EDIT_TASK: 'EDIT_TASK',
  MOVE_TASK: 'MOVE_TASK',
  REMOVE_TASK: 'REMOVE_TASK',
};

// Other constants specific to the app
export const DEFAULT_TASK = {
  title: '',
  description: '',
  status: TASK_STATUSES.TODO,
};

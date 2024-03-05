# CONSTANTS FOR ENDPOINTS

API_ENDPOINT = "/api"

### AUTH ENDPOINTS
AUTH_ENDPOINT = API_ENDPOINT + "/auth"
LOGIN_ENDPOINT = AUTH_ENDPOINT + "/login"
LOGOUT_ENDPOINT = AUTH_ENDPOINT + "/logout"
REGISTER_ENDPOINT = AUTH_ENDPOINT + "/register"
SIGNIN_ENDPOINT = AUTH_ENDPOINT + "/signin"
SIGNOUT_ENDPOINT = AUTH_ENDPOINT + "/signout"
SIGNUP_ENDPOINT = AUTH_ENDPOINT + "/signup"

### LISTS ENDPOINTS
LISTS_ENDPOINT = API_ENDPOINT + "/lists"
CREATE_LIST_ENDPOINT = LISTS_ENDPOINT

GET_ALL_LISTS_ENDPOINT = LISTS_ENDPOINT + "/all"
GET_LIST_ENDPOINT = LISTS_ENDPOINT + "/<int:list_id>"
GET_TASKS_ENDPOINT = GET_LIST_ENDPOINT + "/tasks"

EDIT_LIST_ENDPOINT = GET_LIST_ENDPOINT
DELETE_LIST_ENDPOINT = GET_LIST_ENDPOINT

### TASKS ENDPOINTS
TASKS_ENDPOINT = LISTS_ENDPOINT + "<int:list_id>/tasks"
CREATE_TASK_ENDPOINT = TASKS_ENDPOINT

GET_TASK_ENDPOINT = TASKS_ENDPOINT + "/<int:task_id>"
GET_SUBTASKS_ENDPOINT = GET_TASK_ENDPOINT + "/subtasks"
UPDATE_TASK_STATUS_ENDPOINT = GET_TASK_ENDPOINT
DELETE_TASK_ENDPOINT = GET_TASK_ENDPOINT

EDIT_TASK_ENDPOINT = GET_TASK_ENDPOINT + "/edit"
MOVE_TASK_ENDPOINT = GET_TASK_ENDPOINT + "/move"
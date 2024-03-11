import { TASK_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * TaskService class for handling task-related API calls.
 * Extends ApiService to utilize common HTTP request functionalities.
 */
class TaskService extends ApiService {
	/**
	 * Retrieve all tasks within a specific list.
	 * @param {number} listId - The ID of the list containing the tasks.
	 * @returns {Promise<object>} A promise that resolves to the list of tasks.
	 * @throws {Error} An error if the request fails.
	 */
	async getTasks(listId) {
		return this.handleResponse(this.get(TASK_ENDPOINTS.GET_ALL_TASKS(listId)));
	}

	/**
	 * Retrieve a specific task by its list and task IDs.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to retrieve.
	 * @returns {Promise<object>} A promise that resolves to the task data.
	 */
	async getTask(listId, taskId) {
		return this.handleResponse(
			this.get(TASK_ENDPOINTS.GET_TASK(listId, taskId))
		);
	}
	/**
	 * Retrieve subtasks of a given task.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the parent task.
	 * @returns {Promise<object>} A promise that resolves to the subtask data.
	 */
	async getSubtasks(listId, parentId) {
		return this.handleResponse(
			this.get(TASK_ENDPOINTS.GET_SUBTASKS(listId, parentId))
		);
	}
	/**
	 * Create a new task within a list.
	 *
	 * @param {number} listId - The ID of the list to add the task to.
	 * @param {string}  - The name of the new task. If there is more data, this paramrter can be an object {name: "taskName", ...}
	 * @returns {Promise<object>} A promise that resolves to the newly created task data.
	 */
	async createTask(listId, taskName) {
		return this.handleResponse(
			this.post(TASK_ENDPOINTS.CREATE_TASK(listId), { taskName })
		);
	}

	/**
	 * Create a new subtask for a specific parent task.
	 *
	 * @param {number} listId - The ID of the list containing the parent task.
	 * @param {number} parentId - The ID of the parent task.
	 * @param {string} subtaskName - The name for the new subtask.
	 * @returns {Promise<object>} A promise that resolves to the newly created subtask data.
	 */
	async createSubtask(listId, parentId, subtaskName) {
		return this.handleResponse(
			this.post(TASK_ENDPOINTS.CREATE_SUBTASK(listId, parentId), {
				subtaskName,
			})
		);
	}

	/**
	 * Delete a specific task by its ID.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to delete.
	 * @returns {Promise<object>} A promise that resolves to the result of the deletion.
	 */
	async deleteTask(listId, taskId) {
		return this.handleResponse(
			this.delete(TASK_ENDPOINTS.DELETE_TASK(listId, taskId))
		);
	}
	/**
	 * Edit a specific task by its ID.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to edit.
	 * @param {string} newTaskName - The new name for the task.
	 * @returns {Promise<object>} A promise that resolves to the updated task data.
	 */

	async editTask(listId, taskId, newTaskName) {
		return this.handleResponse(
			this.put(TASK_ENDPOINTS.EDIT_TASK(listId, taskId), { newTaskName })
		);
	}

	/**
	 * Move a task to a different list.
	 *
	 * @param {number} listId - The current ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to move.
	 * @param {number} new_list_id - The ID of the new list to move the task to.
	 * @returns {Promise<object>} A promise that resolves to the result of the move operation.
	 */
	async moveTaskToNewList(listId, taskId, newListId) {
		return this.handleResponse(
			this.put(TASK_ENDPOINTS.MOVE_TO_NEW_LIST(listId, taskId), {
				newListId,
			})
		);
	}

	/**
	 * Move a task to a different parent task.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to move.
	 * @param {number} newParentId - The ID of the new parent task.
	 * @returns {Promise<object>} A promise that resolves to the result of the move operation.
	 */

	async moveTaskToNewParent(listId, taskId, newParentId) {
		return this.handleResponse(
			this.put(TASK_ENDPOINTS.MOVE_TO_NEW_PARENT(listId, taskId), {
				newParentId,
			})
		);
	}

	/**
	 * Update the status of a specific task by its ID.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task whose status is to be updated.
	 * @param {boolean} newStatus - The new status of the task.
	 * @returns {Promise<object>} A promise that resolves to the updated task data.
	 */
	async updateTaskStatus(listId, taskId, newStatus) {
		return this.handleResponse(
			this.put(TASK_ENDPOINTS.UPDATE_TASK_STATUS(listId, taskId), {
				newStatus,
			})
		);
	}
}

export default TaskService;

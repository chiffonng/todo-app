import { TASK_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * TaskService class for handling task-related API calls.
 * Extends ApiService to utilize common HTTP request functionalities.
 */
class TaskService extends ApiService {
	/**
	 * Retrieve a specific task by its list and task IDs.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to retrieve.
	 * @returns {Promise<object>} A promise that resolves to the task data.
	 */
	async getTask(listId, taskId) {
		try {
			const response = await this.get(TASK_ENDPOINTS.GET_TASK(listId, taskId));
			if (response.ok) {
				return response.body;
			}
			throw new Error("Task not found");
		} catch (error) {
			return { error: error.message };
		}
	}
	/**
	 * Retrieve subtasks of a given task.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the parent task.
	 * @returns {Promise<object>} A promise that resolves to the subtask data.
	 */
	async getSubtasks(listId, parentId) {
		try {
			const response = await this.get(
				TASK_ENDPOINTS.GET_SUBTASKS(listId, parentId)
			);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to retrieve subtasks or parent task not found");
		} catch (error) {
			return { error: error.message };
		}
	}
	/**
	 * Create a new task within a list.
	 *
	 * @param {number} listId - The ID of the list to add the task to.
	 * @param {object} taskData - The data for the new task.
	 * @returns {Promise<object>} A promise that resolves to the newly created task data.
	 */
	async createTask(listId, taskData) {
		try {
			const response = await this.post(
				TASK_ENDPOINTS.CREATE_TASK(listId),
				taskData
			);
			if (response.status === 201) {
				return response.body;
			}
			throw new Error("Failed to create task");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Create a new subtask for a specific parent task.
	 *
	 * @param {number} listId - The ID of the list containing the parent task.
	 * @param {number} parentId - The ID of the parent task.
	 * @param {object} subtaskData - The data for the new subtask.
	 * @returns {Promise<object>} A promise that resolves to the newly created subtask data.
	 */
	async createSubtask(listId, parentId, subtaskData) {
		try {
			const response = await this.post(
				TASK_ENDPOINTS.CREATE_SUBTASK(listId, parentId),
				subtaskData
			);
			if (response.status === 201) {
				return response.body;
			}
			throw new Error("Failed to create subtask or parent task not found");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Delete a specific task by its ID.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to delete.
	 * @returns {Promise<object>} A promise that resolves to the result of the deletion.
	 */
	async deleteTask(listId, taskId) {
		try {
			const response = await this.delete(
				TASK_ENDPOINTS.DELETE_TASK(listId, taskId)
			);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to delete task or task not found");
		} catch (error) {
			return { error: error.message };
		}
	}
	/**
	 * Edit a specific task by its ID.
	 *
	 * @param {number} listId - The ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to edit.
	 * @param {object} updatedTaskData - The updated data for the task.
	 * @returns {Promise<object>} A promise that resolves to the updated task data.
	 */

	async editTask(listId, taskId, updatedTaskData) {
		try {
			const response = await this.put(
				TASK_ENDPOINTS.EDIT_TASK(listId, taskId),
				updatedTaskData
			);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to update task or task not found");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Move a task to a different list.
	 *
	 * @param {number} listId - The current ID of the list containing the task.
	 * @param {number} taskId - The ID of the task to move.
	 * @param {number} new_list_id - The ID of the new list to move the task to.
	 * @returns {Promise<object>} A promise that resolves to the result of the move operation.
	 */
	async moveTask(listId, taskId, newListId) {
		try {
			const response = await this.put(
				TASK_ENDPOINTS.MOVE_TASK(listId, taskId),
				{ newListId }
			);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to move the task or task/list not found");
		} catch (error) {
			return { error: error.message };
		}
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
		try {
			const response = await this.put(
				TASK_ENDPOINTS.UPDATE_TASK_STATUS(listId, taskId),
				{ newStatus }
			);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to update task status or task not found");
		} catch (error) {
			return { error: error.message };
		}
	}
}

export default TaskService;

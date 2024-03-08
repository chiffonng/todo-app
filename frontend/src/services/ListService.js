import { LIST_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * ListService class for handling list-related API calls.
 * Extends ApiService to utilize common HTTP request functionalities.
 */
class ListService extends ApiService {
	/**
	 * Retrieve all lists associated with the current user.
	 *
	 * @returns {Promise<object>} A promise that resolves to the response of the GET request.
	 */
	async getAllLists() {
		try {
			const response = await this.get(LIST_ENDPOINTS.GET_ALL_LISTS);
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to retrieve lists");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Retrieve a specific list by its ID.
	 *
	 * @param {number} listId - The ID of the list to retrieve.
	 * @returns {Promise<object>} A promise that resolves to the response of the GET request.
	 */
	async getList(listId) {
		try {
			const response = await this.get(LIST_ENDPOINTS.GET_LIST(listId));
			if (response.ok) {
				return response.body;
			}
			throw new Error("List not found");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Retrieve all tasks from a specific list.
	 *
	 * @param {number} listId - The ID of the list from which tasks are retrieved.
	 * @returns {Promise<object>} A promise that resolves to the response of the GET request.
	 */
	async getTasks(listId) {
		try {
			const response = await this.get(LIST_ENDPOINTS.GET_TASKS(listId));
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to retrieve tasks or list not found");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Create a new task list.
	 *
	 * @param {string} name - The name of the new list to be created.
	 * @returns {Promise<object>} A promise that resolves to the response of the POST request.
	 */
	async createList(name) {
		try {
			const response = await this.post(LIST_ENDPOINTS.CREATE_LIST, { name });
			if (response.status === 201) {
				return response.body;
			}
			throw new Error("Failed to create a new list");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Delete a specific list by its ID.
	 *
	 * @param {number} listId - The ID of the list to be deleted.
	 * @returns {Promise<object>} A promise that resolves to the response of the DELETE request.
	 */
	async deleteList(listId) {
		try {
			const response = await this.delete(LIST_ENDPOINTS.DELETE_LIST(listId));
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to delete list or list not found");
		} catch (error) {
			return { error: error.message };
		}
	}

	/**
	 * Update the name of an existing list.
	 *
	 * @param {number} listId - The ID of the list to be updated.
	 * @param {string} name - The new name for the list.
	 * @returns {Promise<object>} A promise that resolves to the response of the PUT request.
	 */
	async editList(listId, name) {
		try {
			const response = await this.put(LIST_ENDPOINTS.EDIT_LIST(listId), {
				name,
			});
			if (response.ok) {
				return response.body;
			}
			throw new Error("Failed to update list or list not found");
		} catch (error) {
			return { error: error.message };
		}
	}
}

export default ListService;

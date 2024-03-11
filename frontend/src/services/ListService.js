import { LIST_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * @exports ListService class for handling list-related API calls.
 * @extends ApiService to utilize common HTTP request functionalities.
 * Using ApiService, response is standardized to { ok: boolean, status: number, body: object }. body has { message: string, data: object } from the backend.
 */
class ListService extends ApiService {
	/**
	 * Retrieve all lists associated with the current user.
	 *
	 * @returns {Promise<object>} A promise that resolves to the response of the GET request.
	 */
	async getAllLists() {
		return this.handleResponse(this.get(LIST_ENDPOINTS.GET_ALL_LISTS));
	}

	/**
	 * Retrieve a specific list by its ID.
	 *
	 * @param {number} listId - The ID of the list to retrieve.
	 * @returns {Promise<object>} A promise that resolves to the response of the GET request.
	 */
	async getList(listId) {
		return this.handleResponse(this.get(LIST_ENDPOINTS.GET_LIST(listId)));
	}

	/**
	 * Create a new task list.
	 *
	 * @param {string} name - The name of the new list to be created.
	 * @returns {Promise<object>} A promise that resolves to the response of the POST request.
	 */
	async createList(name) {
		return this.handleResponse(this.post(LIST_ENDPOINTS.CREATE_LIST, { name }));
	}

	/**
	 * Delete a specific list by its ID.
	 *
	 * @param {number} listId - The ID of the list to be deleted.
	 * @returns {Promise<object>} A promise that resolves to the response of the DELETE request.
	 */
	async deleteList(listId) {
		return this.handleResponse(this.delete(LIST_ENDPOINTS.DELETE_LIST(listId)));
	}

	/**
	 * Update the name of an existing list.
	 *
	 * @param {number} listId - The ID of the list to be updated.
	 * @param {string} name - The new name for the list.
	 * @returns {Promise<object>} A promise that resolves to the response of the PUT request.
	 */
	async editList(listId, name) {
		return this.handleResponse(
			this.put(LIST_ENDPOINTS.EDIT_LIST(listId), { name })
		);
	}
}

export default ListService;

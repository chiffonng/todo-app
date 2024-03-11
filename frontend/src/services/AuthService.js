import { AUTH_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * @exports AuthService class for handling authentication-related API calls.
 * @extends ApiService to utilize common HTTP request functionalities.
 * Using ApiService, response is standardized to { ok: boolean, status: number, body: object }. body has { message: string, data: object } from the backend.
 */
export default class AuthService extends ApiService {
	/**
	 * Log in a user with a username and password asynchronously.
	 *
	 * @param {string} username - The username.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	async login(username, password) {
		return this.handleResponse(
			this.post(AUTH_ENDPOINTS.LOGIN, { username, password })
		);
	}

	/**
	 * Register a new user asynchronously.
	 *
	 * @param {string} username - The username.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	async register(username, password) {
		return this.handleResponse(
			this.post(AUTH_ENDPOINTS.REGISTER, { username, password })
		);
	}

	/**
	 * Log out the current user asynchronously.
	 *
	 * @returns {Promise<object>} - A promise that resolves to the logout message.
	 */
	async logout() {
		this.handleResponse(this.post(AUTH_ENDPOINTS.LOGOUT));
	}

	/**
	 * Get the current user asynchronously.
	 *
	 * @returns {Promise<object>} - A promise that resolves to the current user data.
	 */
	async getCurrentUser() {
		return this.handleResponse(this.get(AUTH_ENDPOINTS.GET_CURRENT_USER));
	}
}

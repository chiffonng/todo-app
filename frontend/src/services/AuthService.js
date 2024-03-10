import { AUTH_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * AuthService class for handling authentication-related API calls.
 * Extends ApiService to utilize common HTTP request functionalities.
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
		try {
			const response = await this.post(AUTH_ENDPOINTS.LOGIN, {
				username,
				password,
			});

			if (response.ok) {
				return response.body.data ? response.body.data : response.body.message;
			} else {
				throw new Error(response.body.message);
			}
		} catch (error) {
			// Handle any errors that occur during the request
			console.error("Login error:", error);
			throw error;
		}
	}

	/**
	 * Register a new user asynchronously.
	 *
	 * @param {string} username - The username.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	async register(username, password) {
		try {
			const response = await this.post(AUTH_ENDPOINTS.REGISTER, {
				username,
				password,
			});
			if (response.ok) {
				return response.body.data ? response.body.data : response.body.message;
			} else {
				throw new Error(response.body.message);
			}
		} catch (error) {
			// Handle any errors that occur during the request
			console.error("Register error:", error);
			throw error;
		}
	}

	/**
	 * Log out the current user asynchronously.
	 *
	 * @returns {Promise<string>} - A promise that resolves to the logout message.
	 */
	async logout() {
		try {
			const response = await this.post(AUTH_ENDPOINTS.LOGOUT);

			if (response.ok) {
				return response.body.message;
			} else {
				throw new Error(response.body.message);
			}
		} catch (error) {
			console.error("Logout error:", error);
			return Promise.reject(error);
		}
	}

	/**
	 * Get the current user asynchronously.
	 *
	 * @returns {Promise<object>} - A promise that resolves to the current user data.
	 */
	async getCurrentUser() {
		try {
			const response = await this.get(AUTH_ENDPOINTS.CURRENT_USER);

			if (response.ok) {
				return response.body.data;
			} else {
				throw new Error(response.body.message);
			}
		} catch (error) {
			console.error("Get current user error:", error);
			return Promise.reject(error);
		}
	}
}

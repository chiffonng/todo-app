import { AUTH_ENDPOINTS } from "../utils/constants";
import ApiService from "./ApiService";

/**
 * AuthService class for handling authentication-related API calls.
 * Extends ApiService to utilize common HTTP request functionalities.
 */
class AuthService extends ApiService {
	/**
	 * Log in a user with provided credentials.
	 *
	 * @param {string} username - The username of the user.
	 * @param {string} password - The password of the user.
	 * @returns {Promise<object>} A promise that resolves to the response of the login request.
	 */
	async login(username, password) {
		try {
			const response = await this.post(AUTH_ENDPOINTS.LOGIN, {
				username,
				password,
			});
			if (response.ok) {
				// Successful login
				return response.body;
			} else {
				// Handle possible errors based on the response status code
				switch (response.status) {
					case 400:
						throw new Error("Failed to log in");
					case 401:
						throw new Error("Invalid username or password");
					case 500:
						throw new Error("Internal server error");
					default:
						throw new Error("An unknown error occurred");
				}
			}
		} catch (error) {
			// Error handling in case of request failure
			return { error: error.message };
		}
	}

	/**
	 * Log out the current user.
	 *
	 * @returns {Promise<object>} A promise that resolves to the response of the logout request.
	 */
	async logout() {
		try {
			const response = await this.post(AUTH_ENDPOINTS.LOGOUT);
			if (response.ok) {
				// Successful logout
				return { success: true };
			} else {
				// Handle errors during logout
				throw new Error("Failed to log out");
			}
		} catch (error) {
			// Error handling in case of request failure
			return { error: error.message };
		}
	}

	/**
	 * Register a new user with the provided credentials.
	 *
	 * @param {string} username - The username of the new user.
	 * @param {string} password - The password of the new user.
	 * @returns {Promise<object>} A promise that resolves to the response of the register request.
	 */
	async register(username, password) {
		try {
			const response = await this.post(AUTH_ENDPOINTS.REGISTER, {
				username,
				password,
			});
			if (response.status === 201) {
				// Successful user registration
				return response.body;
			} else {
				// Handle errors during user registration
				switch (response.status) {
					case 400:
						throw new Error("Failed to create a user");
					case 500:
						throw new Error("Internal server error");
					default:
						throw new Error("An unknown error occurred");
				}
			}
		} catch (error) {
			// Error handling in case of request failure
			return { error: error.message };
		}
	}
}

export default AuthService;

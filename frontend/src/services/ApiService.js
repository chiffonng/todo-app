import axios from "axios";
/**
 * ApiService class acts as a HTTP client using Axios.
 * This service is responsible for sending API requests to the backend.
 */
export default class ApiService {
	/**
	 * Constructor for the ApiService class.
	 * Initializes an Axios instance with base configuration.
	 */
	constructor() {
		// Create an Axios instance with default configuration
		this.axiosInstance = axios.create({
			baseURL: "/",
			withCredentials: true, // Indicates whether or not cross-site Access-Control requests should be made using credentials
			headers: {
				"Content-Type": "application/json", // Set default headers for requests to 'application/json'
			},
		});
	}

	/**
	 * Generic request function that handles all HTTP requests.
	 *
	 * @param {object} options - The configuration object for the Axios request.
	 * @param {string} options.url - The endpoint URL after the base URL.
	 * @param {string} options.method - The HTTP method (GET, POST, PUT, DELETE).
	 * @param {object} [options.query] - The query parameters for the request.
	 * @param {object} [options.headers] - The headers for the request.
	 * @param {object} [options.body] - The body of the request (for POST/PUT).
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	async request({ url, method, query, headers, body }) {
		try {
			// Make the HTTP request using the Axios instance
			const response = await this.axiosInstance({
				url,
				method,
				params: query,
				headers,
				data: body,
			});

			// Return a response object with a flag indicating success, status code, and the response data
			return {
				ok: response.status >= 200 && response.status < 300,
				status: response.status,
				body: response.data,
			};
		} catch (error) {
			// Return a standardized error object in case of an exception
			return {
				ok: false,
				status: error.response?.status || 500,
				body: error.response?.data || { message: "The server is unresponsive" },
			};
		}
	}

	// Method-specific wrappers for the request function follow

	/**
	 * Wrapper for making GET requests.
	 *
	 * @param {string} url - The endpoint URL after the base URL.
	 * @param {object} [query] - The query parameters for the request.
	 * @param {object} [options] - Additional options for the request.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	get(url, query, options = {}) {
		return this.request({ ...options, method: "GET", url, query });
	}

	/**
	 * Wrapper for making POST requests.
	 *
	 * @param {string} url - The endpoint URL after the base URL.
	 * @param {object} [body] - The body of the request.
	 * @param {object} [options] - Additional options for the request.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	post(url, body, options = {}) {
		return this.request({ ...options, method: "POST", url, body });
	}

	/**
	 * Wrapper for making PUT requests.
	 *
	 * @param {string} url - The endpoint URL after the base URL.
	 * @param {object} [body] - The body of the request.
	 * @param {object} [options] - Additional options for the request.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	put(url, body, options = {}) {
		return this.request({ ...options, method: "PUT", url, body });
	}

	/**
	 * Wrapper for making DELETE requests.
	 *
	 * @param {string} url - The endpoint URL after the base URL.
	 * @param {object} [options] - Additional options for the request.
	 * @returns {Promise<object>} - A promise that resolves to the response object.
	 */
	delete(url, options = {}) {
		return this.request({ ...options, method: "DELETE", url });
	}

	/**
	 * Wrapper for standardize response handling.
	 * @param {Promise<object>} responsePromise - A promise that resolves to the response object.
	 * @returns {Promise<object>} - A promise that resolves to the response data, or rejects with an error message.
	 */
	async handleResponse(responsePromise) {
		try {
			const response = await responsePromise;
			if (!response.ok) {
				throw new Error(response.body.message || "An error occurred");
			}
			return response.body.data || response.body.message;
		} catch (error) {
			const message = "Internal Server Error. Please try again later.";
			return Promise.reject(message);
		}
	}
}

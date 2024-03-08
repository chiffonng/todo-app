import { API_BASE_URL } from "../utils/constant";

/**
 * A client for making API requests to the List App backend.
 */
export default class ApiService {
  /**
   * Creates a new ListAppApiClient instance.
   */
  constructor() {
    /**
     * The base URL for the API requests.
     * @type {string}
     */
    this.base_url = API_BASE_URL;
  }

  /**
   * Sends an API request with the given options.
   * @param {object} options - The options for the API request.
   * @param {string} options.url - The URL for the API request.
   * @param {string} options.method - The HTTP method for the API request.
   * @param {object} [options.query] - The query parameters for the API request.
   * @param {object} [options.headers] - The headers for the API request.
   * @param {object} [options.body] - The body for the API request.
   * @returns {Promise<object>} - A promise that resolves to the API response.
   */
  async request(options) {
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }

    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : null,
      });

      if (response.status === 401) {
        return { unauthorized: true };
      }
    }
    catch (error) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      };
    }

    return {
      ok: response.ok,
      status: response.status,
      body: response.status !== 204 ? await response.json() : null
    };
  }

  /**
   * Sends a GET request to the API.
   * @param {string} url - The URL for the API request.
   * @param {object} [query] - The query parameters for the API request.
   * @param {object} [options] - The options for the API request.
   * @returns {Promise<object>} - A promise that resolves to the API response.
   */
  async get(url, query, options) {
    return this.request({method: 'GET', url, query, ...options});
  }

  /**
   * Sends a POST request to the API.
   * @param {string} url - The URL for the API request.
   * @param {object} [body] - The body for the API request.
   * @param {object} [options] - The options for the API request.
   * @returns {Promise<object>} - A promise that resolves to the API response.
   */
  async post(url, body, options) {
    return this.request({method: 'POST', url, body, ...options});
  }

  /**
   * Sends a PUT request to the API.
   * @param {string} url - The URL for the API request.
   * @param {object} [body] - The body for the API request.
   * @param {object} [options] - The options for the API request.
   * @returns {Promise<object>} - A promise that resolves to the API response.
   */
  async put(url, body, options) {
    return this.request({method: 'PUT', url, body, ...options});
  }

  /**
   * Sends a DELETE request to the API.
   * @param {string} url - The URL for the API request.
   * @param {object} [options] - The options for the API request.
   * @returns {Promise<object>} - A promise that resolves to the API response.
   */
  async delete(url, options) {
    return this.request({method: 'DELETE', url, ...options});
  }
}
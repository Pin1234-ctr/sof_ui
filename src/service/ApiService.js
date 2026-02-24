import { POST_APIS } from '../../connection';

const PUBLIC_APIS = [POST_APIS.login, POST_APIS.register];
/**
 * A global API service function to handle all fetch requests.
 * @param {string} url - The endpoint URL for the API call.
 * @param {object} [options={}] - The options for the fetch request (method, body, headers).
 * @returns {Promise<any>} A promise that resolves with the JSON response.
 */
const ApiService = async (url, options = {}) => {
  let headers = options.headers || {};

  // Detect if body is NOT FormData → keep JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  // Convert normal body to JSON
  if (config.body && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "An unknown API error occurred.",
      }));
      throw new Error(errorData.message || response.statusText);
    }

    return response.status === 204 ? null : response.json();
  } catch (error) {
    console.error("ApiService Error:", error.message);
    throw error;
  }
};

export default ApiService;

import axios from 'axios';

// The base URL for your backend API.
// In development, this might be 'http://localhost:8080/api'.
// We'll set up a proxy to make this cleaner.
const API_URL = '/api/auth';

/**
 * Sends a registration request to the backend.
 * @param {object} userData - The user's registration data (name, email, password, role).
 * @returns {Promise<object>} The response data from the server.
 */
export const register = async (userData) => {
  // The backend endpoint for registration is typically '/api/auth/register' or '/api/auth/signup'
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

/**
 * Sends a login request to the backend.
 * @param {object} credentials - The user's login credentials (email, password).
 * @returns {Promise<object>} The response data from the server (e.g., JWT token and user info).
 */
export const login = async (credentials) => {
  const response = await axios.post('/api/auth/login', credentials);
  if (response.data && response.data.token) {
    return response.data.token; // Return just the token string
  }
  throw new Error('Login response did not contain a token.');
};

// We can add other auth-related API calls here later, like logout, forgotPassword, etc.
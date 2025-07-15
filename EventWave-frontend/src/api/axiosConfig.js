// Corrected and complete code for `axiosConfig.js`

import axios from 'axios';

// 1. FIRST, create the Axios instance and assign it to the 'api' variable.
const api = axios.create({
  // If you use a proxy in vite.config.js, you don't need a full baseURL.
  // If not, you might set it like this:
  // baseURL: 'http://localhost:8082/api'
});

// 2. SECOND, now that the 'api' object exists, you can add an interceptor to it.
api.interceptors.request.use(
  (config) => {
    // This is a special header for ngrok to avoid a warning page. It's fine to keep.
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    // Get the authentication token from local storage.
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Return the modified config so the request can proceed.
    return config;
  },
  (error) => {
    // This handles errors that happen during the request setup.
    return Promise.reject(error);
  }
);

// 3. FINALLY, export the fully configured 'api' instance.
export default api;
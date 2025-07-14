import axios from 'axios';

// Create a new Axios instance. It will automatically use the proxy from vite.config.js.
const api = axios.create();

// Add a request interceptor. This function runs before every request is sent.
api.interceptors.request.use(
  (config) => {
    // Add the ngrok header to bypass the browser warning page.
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    // Get the JWT token from localStorage.
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Return the modified config to proceed with the request.
    return config;
  },
  (error) => {
    // Handle any request errors.
    return Promise.reject(error);
  }
);

export default api;
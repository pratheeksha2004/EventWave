import api from './axiosConfig'; // Import the configured axios instance

/**
 * Fetches the profile of the currently logged-in user.
 * API: GET /api/user/me
 */
export const getUserProfile = async () => {
  // Use 'api.get' to automatically include the Authorization header
  const response = await api.get('/api/user/me');
  return response.data;
};

/**
 * Updates the user's profile.
 * API: PUT /api/user/update
 * @param {object} profileData - The updated profile data, e.g., { userId, userName, email }.
 */
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/api/user/update', profileData);
  return response.data;
};
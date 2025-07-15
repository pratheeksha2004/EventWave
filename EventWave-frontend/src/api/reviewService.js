// In src/api/reviewService.js
import api from './axiosConfig';



// This function is for ATTENDEES (used on EventDetailsPage)
export const getReviewsForEvent = async (eventId) => {
  const response = await api.get(`/api/attendee/events/${eventId}/reviews`);
  return response.data;
};

// --- THIS IS THE NEW, CORRECT FUNCTION FOR ORGANIZERS ---
/**
 * Fetches reviews for a specific event from an ORGANIZER's perspective.
 * API: GET /api/organizer/events/{eventId}/reviews
 * @param {string|number} eventId The ID of the event.
 */
export const getReviewsForOrganizerEvent = async (eventId) => {
  // Use the correct URL from your Postman test
  const response = await api.get(`/api/organizer/events/${eventId}/reviews`);
  return response.data;
};

// ... other functions like postReviewForEvent ...

/**
 * Posts a new review for a specific event.
 * The backend knows the user from the auth token.
 * API: POST /api/attendee/events/{eventId}/reviews
 * @param {string|number} eventId The ID of the event.
 * @param {object} feedbackData The review content, e.g., { feedback: "Great event!" }.
 */
export const postReviewForEvent = async (eventId, feedbackData) => {
  const response = await api.post(`/api/attendee/events/${eventId}/reviews`, feedbackData);
  return response.data;
};

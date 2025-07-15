// ✅ FIX: Correctly import the configured axios instance.
// This assumes 'axiosConfig.js' is in the same 'api' folder.
import api from './axiosConfig';

import placeholder1 from '../assets/event_placeholder_1.JPG';
import placeholder2 from '../assets/event_placeholder_2.JPEG';
import placeholder3 from '../assets/event_placeholder_3.JPG';
import placeholder4 from '../assets/event_placeholder_4.JPG';
import placeholder5 from '../assets/event_placeholder_5.JPG';
const placeholderImages = [placeholder1, placeholder2, placeholder3, placeholder4, placeholder5];


// ✅ FIX: Define the helper function ONCE at the top so all other functions can use it.
const addImagesToEvents = (events) => {
  // Safety check to prevent crashes
  if (!Array.isArray(events)) {
    console.error("API response was not an array:", events);
    return []; 
  }
  // The backend uses 'eventId' for uniqueness, so we use it here.
  return events.map(event => ({
    ...event,
    imageUrl: placeholderImages[event.eventId % placeholderImages.length]
  }));
};


// ===============================================
// ATTENDEE API FUNCTIONS
// ===============================================

// Gets all events for the main dashboard
export const getEvents = async () => {
  const response = await api.get('/api/attendee/events');
  return addImagesToEvents(response.data);
};

// Searches events by title
export const searchEvents = async (query) => {
  const response = await api.get(`/api/attendee/events/search/title/${query}`);
  return addImagesToEvents(response.data);
};

// Gets the events a user has registered for
export const getMyRegisteredEvents = async () => {
  const response = await api.get('/api/attendee/events/my-registrations');
  return addImagesToEvents(response.data);
};

// Gets the user's wishlist
export const getMyWishlist = async () => {
  const response = await api.get('/api/attendee/wishlist');
  return addImagesToEvents(response.data);
};

// Adds an event to the user's wishlist
export const addToWishlist = async (eventId) => {
  const response = await api.post(`/api/attendee/wishlist/${eventId}`, {});
  return response.data;
};

// Removes an event from the user's wishlist
export const removeFromWishlist = async (eventId) => {
  const response = await api.delete(`/api/attendee/wishlist/${eventId}`);
  return response.data;
};


// ===============================================
// ORGANIZER API FUNCTIONS
// ===============================================

// Gets the events created by the logged-in organizer
export const getMyOrganizerEvents = async () => {
  const response = await api.get('/api/organizer/events/my-events');
  return response.data; // Organizer table doesn't need placeholder images
};

// Creates a new event
export const createEvent = async (eventData) => {
  const response = await api.post('/api/organizer/events', eventData);
  return response.data;
};

// Gets the list of attendees for an organizer's event
export const getAttendeesForEvent = async (eventId) => {
  const response = await api.get(`/api/registrations/attendees/${eventId}`);
  return response.data;
};


// ===============================================
// REGISTRATION API FUNCTIONS
// ===============================================

/**
 * Registers the logged-in user for an event.
 * API: POST /api/registrations/register/{eventId}
 * Body: { "eventId": ... }
 * @param {number} eventId The ID of the event to register for.
 */
export const registerForEvent = async (eventId) => {
  const url = `/api/registrations/register/${eventId}`;
  const requestBody = { eventId: eventId };
  const response = await api.post(url, requestBody);
  return response.data;
};

/**
 * Unregisters the logged-in user from an event.
 * API: POST /api/registrations/unregister  <-- The API expects a POST request.
 * Body: { "userId": ..., "eventId": ... }
 * @param {object} unregistrationData Object containing userId and eventId.
 */
export const unregisterFromEvent = async (unregistrationData) => {
  console.log("Sending unregister POST request with data:", unregistrationData);

  // --- THE FIX: Use api.post to match the successful Postman request ---
  // A POST request sends the body as the second argument directly.
  const response = await api.post('/api/registrations/unregister', unregistrationData);
  
  return response.data;
};


// ===============================================
// MOCK FUNCTIONS (For any pages not yet integrated)
// ===============================================




/**
 * Fetches the details of a single event for editing.
 * This is a protected endpoint for the organizer.
 * API: GET /api/organizer/events/{eventId} (We need to confirm this URL with the backend)
 * @param {number} eventId The ID of the event to fetch.
 */
export const getOrganizerEventById = async (eventId) => {
  // Let's assume the endpoint is /api/organizer/events/{eventId}
  const response = await api.get(`/api/organizer/events/${eventId}`);
  return response.data;
};

/**
 * Updates an existing event.
 * API: PUT /api/organizer/events/{eventId}
 * @param {number} eventId The ID of the event to update.
 * @param {object} eventData The updated event data.
 */
export const updateEvent = async (eventId, eventData) => {
  const response = await api.put(`/api/organizer/events/${eventId}`, eventData);
  return response.data;
};


/**
 * Deletes an event created by the organizer.
 * API: DELETE /api/organizer/events/{eventId}
 * @param {number} eventId The ID of the event to delete.
 */
export const deleteEvent = async (eventId) => {
  // Use 'api.delete' to ensure the Authorization header is sent.
  const response = await api.delete(`/api/organizer/events/${eventId}`);
  return response.data; // The backend returns no content, but we'll return the response data anyway.
};



/**
 * Fetches the details for a single event by its ID.
 * API: GET /api/attendee/events/{eventId}
 * @param {string|number} eventId The ID of the event to fetch.
 */
export const getEventById = async (eventId) => {
  // The user is identified by the auth token, which is added automatically by the interceptor.
  const response = await api.get(`/api/attendee/events/${eventId}`);
  return response.data;
};




/**
 * Fetches events by a specific category.
 * API: GET /api/attendee/events/by-category/{category}
 * @param {string} category The category to filter by.
 */
export const getEventsByCategory = async (category) => {
  const response = await api.get(`/api/attendee/events/by-category/${category}`);
  return response.data;
};

/**
 * Fetches events by a specific location.
 * API: GET /api/attendee/events/filter/location/{location}
 * @param {string} location The location to filter by.
 */
export const getEventsByLocation = async (location) => {
  const response = await api.get(`/api/attendee/events/filter/location/${location}`);
  return response.data;
};

export const getAllEvents = async () => {
  const response = await api.get('/api/attendee/events');
  return response.data;
};

/**
 * Fetches events within a date range.
 * API: GET /api/attendee/events/filter/date-range?startDate=...&endDate=...
 * @param {string} startDate The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate The end date in 'YYYY-MM-DD' format.
 */
export const getEventsByDateRange = async (startDate, endDate) => {
  // We use query parameters for the date range
  const response = await api.get(`/api/attendee/events/filter/date-range?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

/**
 * Fetches events by searching for a title.
 * API: GET /api/attendee/events/search/title/{title}
 * @param {string} title The search term for the event title.
 */
export const searchEventsByTitle = async (title) => {
  // --- THE FIX ---
  // We construct the URL by putting the title directly into the path,
  // matching the backend's required format.
  const response = await api.get(`/api/attendee/events/search/title/${encodeURIComponent(title)}`);
  return response.data;
};


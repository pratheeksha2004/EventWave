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
 * API: DELETE /api/registrations/unregister
 * Body: { "userId": ..., "eventId": ... }
 * @param {object} unregistrationData Object containing userId and eventId.
 */
export const unregisterFromEvent = async (unregistrationData) => {
  // A DELETE request with a body is handled like this in axios
  const response = await api.delete('/api/registrations/unregister', { data: unregistrationData });
  return response.data;
};


// ===============================================
// MOCK FUNCTIONS (For any pages not yet integrated)
// ===============================================

// Only keep mock functions for endpoints that are NOT yet implemented.
// For example, if getEventById is not yet on the backend:
const mockEventData = { eventId: 99, title: 'Mock Event', dateTime: '2025-01-01T12:00:00Z', location: 'Mock Location' };
export const getEventById = async (id) => {
    return new Promise(resolve => setTimeout(() => resolve(mockEventData), 500));
};


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
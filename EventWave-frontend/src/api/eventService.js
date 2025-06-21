import axios from 'axios';

// The base URL for your backend API for events.
const API_URL = '/api/events';

// --- MOCK DATA ---
// This is fake data to simulate what the backend will send.
const mockEvents = [
  {
    id: 1,
    title: 'Downtown Music Fest 2024',
    date: '2024-10-26T19:00:00Z', // Use ISO format for dates
    location: 'Central Park, Cityville',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 2,
    title: 'React & Beyond Tech Conference',
    date: '2024-11-09T09:00:00Z',
    location: 'Innovation Hall',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    title: 'Community Charity Marathon',
    date: '2024-11-15T07:30:00Z',
    location: 'Lakeside Route',
    imageUrl: 'https://images.pexels.com/photos/2749500/pexels-photo-2749500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 4,
    title: 'Indie Film Screening Night',
    date: '2024-11-22T20:00:00Z',
    location: 'The Grand Cinema',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

/**
 * Fetches all events from the backend.
 * For now, it returns mock data after a short delay to simulate a network request.
 */
export const getEvents = async () => {
  console.log("Fetching events (mock)...");
  // When the backend is ready, you'll replace this with:
  // const response = await axios.get(API_URL);
  // return response.data;

  // --- MOCK IMPLEMENTATION ---
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 1000); // 1-second delay
  });
};

/**
 * Fetches a single event by its ID.
 * This will be used for the Event Detail page later.
 */
export const getEventById = async (id) => {
    console.log(`Fetching event with id ${id} (mock)...`);
    // When backend is ready:
    // const response = await axios.get(`${API_URL}/${id}`);
    // return response.data;
    
    // --- MOCK IMPLEMENTATION ---
    return new Promise(resolve => {
        setTimeout(() => {
            const event = mockEvents.find(e => e.id === parseInt(id));
            resolve(event);
        }, 500);
    });
};
// ... (keep the existing getEvents and getEventById functions)

// --- MOCK DATA for Registered Events ---
const mockRegisteredEvents = [
  {
    id: 2,
    title: 'React & Beyond Tech Conference',
    date: '2024-11-09T09:00:00Z',
    location: 'Innovation Hall',
    imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 4,
    title: 'Indie Film Screening Night',
    date: '2024-11-22T20:00:00Z',
    location: 'The Grand Cinema',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];


/**
 * Fetches events the current user is registered for.
 * In a real app, this would be a protected endpoint like GET /api/my-registrations
 */
export const getMyRegisteredEvents = async () => {
  console.log("Fetching MY registered events (mock)...");
  
  // --- MOCK IMPLEMENTATION ---
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockRegisteredEvents);
    }, 800); // 0.8-second delay
  });
};


// ... (keep all the existing functions)

// --- MOCK DATA for Wishlisted Events ---
// Let's say the user has favorited one event that they haven't registered for yet.
const mockWishlistedEvents = [
  {
    id: 1,
    title: 'Downtown Music Fest 2024',
    date: '2024-10-26T19:00:00Z',
    location: 'Central Park, Cityville',
    imageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 3,
    title: 'Community Charity Marathon',
    date: '2024-11-15T07:30:00Z',
    location: 'Lakeside Route',
    imageUrl: 'https://images.pexels.com/photos/2749500/pexels-photo-2749500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

/**
 * Fetches events the current user has added to their wishlist.
 * In a real app, this would be a protected endpoint like GET /api/my-wishlist
 */
export const getMyWishlist = async () => {
  console.log("Fetching MY wishlist (mock)...");
  
  // --- MOCK IMPLEMENTATION ---
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockWishlistedEvents);
    }, 600); // 0.6-second delay
  });
};


// ... (keep all the existing functions)

// --- MOCK DATA for Organizer's Events ---
// Let's create some events specifically for our organizer.
const mockOrganizerEvents = [
  {
    id: 101,
    title: 'Annual Tech Startup Pitch Night',
    date: '2024-12-05T18:00:00Z',
    registered: 88,
    capacity: 150,
    status: 'Published'
  },
  {
    id: 102,
    title: 'Neighborhood Art & Wine Fair',
    date: '2024-12-14T12:00:00Z',
    registered: 120,
    capacity: 120,
    status: 'Published'
  },
  {
    id: 103,
    title: 'Beginner\'s Guide to Investing Workshop',
    date: '2025-01-10T19:00:00Z',
    registered: 0,
    capacity: 50,
    status: 'Draft'
  },
];

/**
 * Fetches events created by the current organizer.
 * In a real app, this would be a protected endpoint like GET /api/organizer/my-events
 */
export const getMyOrganizerEvents = async () => {
  console.log("Fetching Organizer's events (mock)...");
  
  // --- MOCK IMPLEMENTATION ---
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockOrganizerEvents);
    }, 1000); // 1-second delay
  });
};


// ... (keep all the existing functions)

// --- MOCK DATA for a specific event's attendees ---
const mockAttendees = [
  { id: 201, name: 'Alice Johnson', email: 'alice.j@example.com', registeredAt: '2024-10-15T10:00:00Z' },
  { id: 202, name: 'Bob Williams', email: 'b.williams@example.com', registeredAt: '2024-10-16T11:30:00Z' },
  { id: 203, name: 'Charlie Brown', email: 'charlie.b@example.com', registeredAt: '2024-10-17T14:15:00Z' },
  { id: 204, name: 'Diana Miller', email: 'diana.m@example.com', registeredAt: '2024-10-18T16:45:00Z' },
  { id: 205, name: 'Ethan Davis', email: 'ethan.d@example.com', registeredAt: '2024-10-19T09:00:00Z' },
];

/**
 * Fetches the list of attendees for a specific event.
 * In a real app, this would be a protected endpoint like GET /api/organizer/events/{eventId}/attendees
 * @param {string} eventId - The ID of the event.
 */
export const getAttendeesForEvent = async (eventId) => {
  console.log(`Fetching attendees for event ID: ${eventId} (mock)...`);
  
  // --- MOCK IMPLEMENTATION ---
  // In a real app, the backend would return different attendees for different event IDs.
  // For our mock, we'll just return the same list every time.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockAttendees);
    }, 700); // 0.7-second delay
  });
};
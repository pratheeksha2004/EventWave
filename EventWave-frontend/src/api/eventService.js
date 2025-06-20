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
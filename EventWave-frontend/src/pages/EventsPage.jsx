import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { getEvents } from '../api/eventService'; // <-- IMPORT the API function

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents(); // This calls our mock API
        setEvents(data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // The empty array [] means this effect runs once when the component mounts

  return (
    <div className="bg-slate-900 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Upcoming Events
        </h1>

        {loading && (
          <p className="text-center text-slate-300 text-xl">Loading events...</p>
        )}
        
        {error && (
          <p className="text-center text-red-400 text-xl">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
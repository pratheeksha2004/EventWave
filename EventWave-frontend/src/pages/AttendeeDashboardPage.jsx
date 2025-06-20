import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents } from '../api/eventService';

const AttendeeDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const data = await getEvents(); // This still uses our mock API service
      setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white">
        Browse Upcoming Events
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Find your next experience.</p>
      
      <div className="mt-12">
        {loading ? (
          <p className="text-center text-slate-300 text-xl">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeDashboardPage;
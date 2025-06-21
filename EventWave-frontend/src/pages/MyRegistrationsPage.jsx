import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegisteredEvents } from '../api/eventService';
import RegisteredEventCard from '../components/RegisteredEventCard';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await getMyRegisteredEvents(); // Call our new mock function
        setRegistrations(data);
      } catch (err) {
        setError("Could not fetch your registrations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-slate-400">Loading your events...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400">{error}</p>;
    }
    if (registrations.length === 0) {
      return (
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white">Nothing here yet!</h2>
          <p className="text-slate-400 mt-2">You haven't registered for any upcoming events.</p>
          <Link to="/dashboard" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition">
            Explore Events
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {registrations.map(event => (
          <RegisteredEventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-2">My Registered Events</h1>
      <p className="text-slate-400 mb-8">Here are all the events you're signed up for.</p>
      
      {renderContent()}
    </div>
  );
};

export default MyRegistrationsPage;
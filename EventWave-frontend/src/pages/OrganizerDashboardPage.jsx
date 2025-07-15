import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrganizerEvents, deleteEvent } from '../api/eventService'; 

// StatCard component (no changes needed)
const StatCard = ({ title, value, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg flex items-center gap-4">
    <div className="bg-slate-900 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const OrganizerDashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyOrganizerEvents();
        setMyEvents(data);
      } catch (err) {
        console.error("Error fetching organizer events:", err);
        setError("Could not load your events. You may not have the correct permissions or the server might be down.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizerEvents();
  }, []);

  // --- FIX #1: Replaced totalAttendees calculation with totalPotentialRevenue ---
  // This calculates the maximum possible revenue based on ticket price and capacity.
  const totalPotentialRevenue = myEvents.reduce((sum, event) => {
    // Ensure that price and capacity are numbers before multiplying
    const eventRevenue = (Number(event.price) || 0) * (Number(event.capacity) || 0);
    return sum + eventRevenue;
  }, 0);

  const handleDelete = async (eventIdToDelete) => {
    if (window.confirm('Are you sure you want to permanently delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(eventIdToDelete);
        setMyEvents(currentEvents => 
          currentEvents.filter(event => event.eventId !== eventIdToDelete)
        );
        alert('Event deleted successfully!');
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert(`Error: ${err.response?.data?.message || 'Could not delete the event.'}`);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section (no changes) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your events and view your stats.</p>
        </div>
        <Link to="/create-event" className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-2 px-5 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Create New Event
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Events Created" value={myEvents.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        
        {/* --- FIX #2: Updated the StatCard to display the new revenue data --- */}
        <StatCard 
          title="Total Potential Revenue" 
          // Format the number to look like currency with commas
          value={`$${totalPotentialRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} 
        />
        
        <StatCard title="Upcoming Events" value={myEvents.filter(e => new Date(e.dateTime) > new Date()).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>} />
      </div>

      {/* Events Table (no changes) */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4"><h2 className="text-xl font-bold text-white">My Event Listings</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Event Title</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Date</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Capacity</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Status</th>
                <th className="px-6 py-3 text-right font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading && <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading your events...</td></tr>}
              {error && <tr><td colSpan="5" className="p-8 text-center text-red-400 bg-red-900/40">{error}</td></tr>}
              {!loading && !error && myEvents.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">You haven't created any events yet.</td></tr>}
              {!loading && !error && myEvents.map(event => (
                <tr key={event.eventId} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{new Date(event.dateTime).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{event.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${event.status === 'Published' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{event.status || 'Published'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <div className="flex justify-end gap-4">
                      <Link to={`/events/${event.eventId}/attendees`} className="text-sky-400 hover:text-sky-300">Attendees details</Link>
                      <Link to={`/events/${event.eventId}/edit`} className="text-indigo-400 hover:text-indigo-300">Edit</Link>
                      <button onClick={() => handleDelete(event.eventId)} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboardPage;
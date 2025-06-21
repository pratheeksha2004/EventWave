import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrganizerEvents } from '../api/eventService';

// A small, reusable component for the summary stats
const StatCard = ({ title, value, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg flex items-center gap-4">
    <div className="bg-slate-900 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const OrganizerDashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrganizerEvents().then(data => {
      setMyEvents(data);
      setLoading(false);
    });
  }, []);

  const totalAttendees = myEvents.reduce((sum, event) => sum + event.registered, 0);

  const handleDelete = (eventId) => {
    // **API HOOK:** Call API to delete the event
    // await deleteEventAPI(eventId);
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setMyEvents(currentEvents => currentEvents.filter(event => event.id !== eventId));
      console.log(`Deleting event ID: ${eventId}`);
      alert('Event deleted! (UI only)');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your events and view your stats.</p>
        </div>
        <Link 
          to="/create-event"
          className="mt-4 md:mt-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-2 px-5 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Create New Event
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Events Created" value={myEvents.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Total Attendees" value={totalAttendees} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Upcoming Events" value={myEvents.filter(e => new Date(e.date) > new Date()).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>} />
      </div>

      {/* Events Table */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">My Event Listings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Event Title</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Date</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Attendees</th>
                <th className="px-6 py-3 text-left font-medium text-slate-300">Status</th>
                <th className="px-6 py-3 text-right font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading your events...</td></tr>
              ) : myEvents.map(event => (
                <tr key={event.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{event.registered} / {event.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'Published' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>{event.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <div className="flex justify-end gap-4">
                      <Link to={`/events/${event.id}/attendees`} className="text-sky-400 hover:text-sky-300">View</Link>
                      <Link to={`/events/${event.id}/edit`} className="text-indigo-400 hover:text-indigo-300">Edit</Link>
                      <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300">Delete</button>
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
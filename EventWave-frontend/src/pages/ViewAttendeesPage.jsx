import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// ✅ Import the REAL API function
import { getAttendeesForEvent } from '../api/eventService'; 

const ViewAttendeesPage = () => {
  const { id: eventId } = useParams(); // Get the event ID from the URL
  
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        setError(null);
        // Pass the eventId from the URL to our API function
        const data = await getAttendeesForEvent(eventId);
        setAttendees(data);
      } catch (err) {
        console.error("Failed to fetch attendees:", err);
        setError("Could not fetch the attendee list. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]); // The effect re-runs if the eventId in the URL changes

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Link to="/organizer-dashboard" className="text-sm text-indigo-400 hover:underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mt-2">Event Attendees</h1>
        <p className="text-slate-400">Viewing registrations for Event ID: {eventId}</p>
      </div>

      {/* Attendee Table */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Registered Users ({attendees.length})</h2>
          <button className="text-sm bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition">
            Export List
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 font-medium text-slate-300">Attendee Name</th>
                <th className="px-6 py-3 font-medium text-slate-300">Email Address</th>
                <th className="px-6 py-3 font-medium text-slate-300">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading && (
                <tr><td colSpan="3" className="text-center p-8 text-slate-400">Loading attendees...</td></tr>
              )}
              {error && (
                 <tr><td colSpan="3" className="text-center p-8 text-red-400">{error}</td></tr>
              )}
              {!loading && !error && attendees.length === 0 && (
                <tr><td colSpan="3" className="text-center p-8 text-slate-400">No one has registered for this event yet.</td></tr>
              )}
              {!loading && !error && attendees.map(attendee => (
                // Assuming the backend sends a unique 'userId' or 'registrationId'
                <tr key={attendee.userId} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{attendee.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">{attendee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                    {new Date(attendee.registeredAt).toLocaleDateString()}
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

export default ViewAttendeesPage;
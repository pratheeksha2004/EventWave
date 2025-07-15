import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../api/eventService';
import { placeholderImages } from '../assets/image-placeholder';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Could not load event details. The event may not exist or an error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { formattedDate: 'N/A', formattedTime: '' };
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
    return { formattedDate, formattedTime };
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-semibold">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  if (!event) return null;

  let displayImageUrl;
  if (event.imageUrl) {
    displayImageUrl = event.imageUrl;
  } else {
    const placeholderIndex = event.id % placeholderImages.length;
    displayImageUrl = placeholderImages[placeholderIndex];
  }

  const { formattedDate, formattedTime } = formatDateTime(event.dateTime);

  // Reusable component for the detail items for cleaner code
  const DetailItem = ({ icon, label, value, subValue }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-lg">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-700/50 text-indigo-400">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-bold text-white">{value}</p>
        {subValue && <p className="text-sm text-slate-400">{subValue}</p>}
      </div>
    </div>
  );

  return (
    // Main container with padding and a max-width for better centering on large screens
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
        
        {/* Image with a subtle gradient overlay */}
        <div className="relative">
          <img src={displayImageUrl} alt={event.title} className="w-full h-56 md:h-72 object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="p-6 sm:p-8">
          {/* Main header section */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 -mt-16 sm:-mt-20 relative z-10 px-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">{event.title}</h1>
            <button 
              onClick={() => alert('Registration feature to be implemented!')}
              className="flex-shrink-0 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Register Now
            </button>
          </div>

          {/* Details Grid - more structured and visually appealing */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="Date & Time"
              value={formattedDate}
              subValue={formattedTime}
            />
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
              label="Location"
              value={event.location}
            />
             <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
              label="Price"
              value={`$${Number(event.price).toFixed(2)}`}
            />
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              label="Capacity"
              value={`${event.capacity} people`}
            />
          </div>
          
          {/* Description section with better typography */}
          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <h2 className="text-2xl font-bold text-white tracking-tight">About this Event</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">{event.description}</p>
          </div>

          <div className="mt-10 text-center">
            <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              ← Back to all events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
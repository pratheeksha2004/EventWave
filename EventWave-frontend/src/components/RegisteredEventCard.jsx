import { Link } from 'react-router-dom';
import { useState } from 'react';

const RegisteredEventCard = ({ event, onUnregister }) => {
  const [isUnregistering, setIsUnregistering] = useState(false);

  const formattedDate = new Date(event.dateTime).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedTime = new Date(event.dateTime).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  const handleUnregisterClick = async () => {
    setIsUnregistering(true);
    // Call the function passed down from the parent (MyRegistrationsPage)
    await onUnregister(event.eventId);
    // No need to set isUnregistering back to false, as the component will be removed from the DOM.
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6 p-4">
      <img src={event.imageUrl} alt={event.title} className="w-full md:w-48 h-32 md:h-full object-cover rounded-md"/>
      
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xl font-bold text-white">{event.title}</h3>
        <p className="text-indigo-400 font-semibold mt-1">{formattedDate} at {formattedTime}</p>
        <p className="text-slate-400 mt-2 flex items-center justify-center md:justify-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
          {event.location}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <Link to={`/events/${event.eventId}`} className="bg-slate-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors text-center">
          View Details
        </Link>
        <button 
          onClick={handleUnregisterClick}
          disabled={isUnregistering}
          className="bg-red-800/70 text-red-300 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUnregistering ? 'Processing...' : 'Unregister'}
        </button>
      </div>
    </div>
  );
};

export default RegisteredEventCard;
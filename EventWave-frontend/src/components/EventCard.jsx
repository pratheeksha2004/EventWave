import { useState } from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleRegisterClick = (e) => {
    e.preventDefault(); // Prevent link navigation when button is clicked
    console.log(`Registering for event ID: ${event.id}`);
    // **API HOOK:** This is where you'll call the API to register the user for the event.
    // await registerForEvent(event.id);
    alert(`Registration for "${event.title}" is in progress! (API call needed)`);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
    // **API HOOK:** This is where you'll call the API to add/remove from wishlist.
    // await toggleFavorite(event.id);
    console.log(`Toggling favorite for event ID: ${event.id}`);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <Link to={`/events/${event.id}`} className="flex-grow">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />
          <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${isFavorited ? 'text-red-500' : 'text-white'}`} fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-indigo-400 font-semibold mb-2">{formattedDate}</p>
          <h3 className="text-xl font-bold text-white mb-2 truncate">{event.title}</h3>
          <p className="text-slate-400 flex items-center">
            {/* Location Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {event.location}
          </p>
        </div>
      </Link>
      <div className="px-6 pb-4">
        <button
          onClick={handleRegisterClick}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
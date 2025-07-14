import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerForEvent, addToWishlist } from '../api/eventService';

const EventCard = ({ event }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Add a loading state for the button
  const navigate = useNavigate(); // Hook to redirect the user after registration

  // This formatting function is correct.
  const formattedDate = new Date(event.dateTime).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  // This is the code inside EventCard.jsx

// inside EventCard.jsx

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      await registerForEvent(event.eventId);
      
      alert(`Successfully registered for "${event.title}"!`);
      
      // Use this to force a full page navigation and reload
      window.location.href = '/my-registrations';

    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred during registration.';
      alert(`Could not register for this event. Reason: ${errorMessage}`);
    } finally {
      setIsRegistering(false);
    }
  };

   const handleFavoriteClick = async (e) => {
    e.preventDefault();
    // We won't toggle it here yet, as the backend is the source of truth.
    // A more advanced implementation would handle the toggle state.
    
    try {
      // Call the API to add the event to the wishlist
      const response = await addToWishlist(event.eventId);
      setIsFavorited(true); // Visually confirm it was added
      alert(response); // Show the success message, e.g., "wishlist added"
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert(`Error: ${err.response?.data?.message || 'Could not add to wishlist'}`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      {/* Use event.eventId for the link */}
      <Link to={`/events/${event.eventId}`} className="flex-grow">
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            {event.location}
          </p>
        </div>
      </Link>
      <div className="px-6 pb-4">
        <button
          onClick={handleRegisterClick}
          disabled={isRegistering} // Disable button while the API call is in progress
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Change button text based on loading state */}
          {isRegistering ? 'Registering...' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
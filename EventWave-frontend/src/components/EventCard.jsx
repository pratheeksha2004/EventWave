import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerForEvent, addToWishlist } from '../api/eventService';
// --- STEP 1: Import the placeholder images array ---
import { placeholderImages } from '../assets/image-placeholder';

const EventCard = ({ event }) => {
  // Your existing state variables are perfect
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Your date formatting is correct
  const formattedDate = new Date(event.dateTime).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  // --- STEP 2: Logic to select the correct image ---
  let displayImageUrl;
  if (event.imageUrl) {
    // If the backend provides a real image URL, use it.
    displayImageUrl = event.imageUrl;
  } else {
    // Otherwise, pick a placeholder based on the event's ID.
    // The modulo operator (%) ensures we always get a valid index.
    // We check for event.eventId first, then event.id, to be safe.
    const eventIdForImage = event.eventId || event.id;
    const placeholderIndex = eventIdForImage % placeholderImages.length;
    displayImageUrl = placeholderImages[placeholderIndex];
  }

  // Your handleRegister function is correct
  const handleRegister = async () => {
    setIsRegistering(true); // Set loading state to true
    console.log("1. handleRegister function has been triggered!");
    try {
      const eventId = event.eventId;
      console.log("2. Attempting to register for eventId:", eventId);
      if (!eventId) {
        console.error("CRITICAL: eventId is missing. Cannot register.");
        alert("Error: Cannot identify the event.");
        return;
      }
      const response = await registerForEvent(eventId);
      console.log("4. API call was successful! Response:", response);
      alert("Successfully registered for the event!");
    } catch (err) {
      console.error("CRITICAL: The API call failed with an error.", err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false); // Reset loading state
    }
  };

  // Your handleFavoriteClick function is correct
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the Link from navigating when the heart is clicked
    try {
      const response = await addToWishlist(event.eventId);
      setIsFavorited(true);
      alert(response);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert(`Error: ${err.response?.data?.message || 'Could not add to wishlist'}`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <Link to={`/events/${event.eventId}`} className="flex-grow flex flex-col">
        <div className="relative">
          {/* --- STEP 3: Use the selected displayImageUrl here --- */}
          <img className="w-full h-48 object-cover" src={displayImageUrl} alt={event.title} />
          <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full backdrop-blur-sm z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-all ${isFavorited ? 'text-red-500' : 'text-white'}`} fill={isFavorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-6 flex-grow">
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
          onClick={handleRegister}
          disabled={isRegistering}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegistering ? 'Registering...' : 'Register Now'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
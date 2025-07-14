import { Link } from 'react-router-dom';

const WishlistEventCard = ({ event, onRemove }) => {
  // ✅ FIX: Use the correct data keys from the API response.
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const handleRemoveClick = () => {
    onRemove(event.eventId); 
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg flex flex-col md:flex-row gap-0 overflow-hidden transform hover:shadow-indigo-500/20 transition-all duration-300">
      {/* Image Section - This will use the imageUrl we add in the service */}
      <div className="md:w-1/3">
        <img className="w-full h-48 md:h-full object-cover" src={event.imageUrl} alt={event.eventTitle} />
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 flex flex-col p-6">
        <div className="flex-grow">
          {/* ✅ FIX: Use 'eventTitle' instead of 'title' */}
          <h3 className="text-2xl font-bold text-white leading-tight">{event.eventTitle}</h3>
          <p className="text-indigo-400 font-semibold mt-2">{formattedDate}</p>
          <p className="text-slate-400 mt-2 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
             {/* ✅ FIX: Use 'eventLocation' instead of 'location' */}
            {event.eventLocation}
          </p>
          {/* You can also add the description if the API provides it */}
          {/* <p className="text-slate-400 mt-3 text-sm">{event.eventDescription}</p> */}
        </div>
        
        {/* Actions Section */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to={`/events/${event.eventId}`} 
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/30"
          >
            View Event & Register
          </Link>
          
          <button 
            onClick={handleRemoveClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistEventCard;
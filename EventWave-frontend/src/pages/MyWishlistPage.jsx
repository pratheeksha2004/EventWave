import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// ✅ FIX: Import the REAL API functions
import { getMyWishlist, removeFromWishlist } from '../api/eventService'; 
import WishlistEventCard from '../components/WishlistEventCard';

const MyWishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function now fetches REAL data from the backend
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await getMyWishlist();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setError("Could not fetch your wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []); // The empty array ensures this runs only once when the page loads

  // ✅ FIX: This function now calls the REAL remove API
  const handleRemoveFromWishlist = async (eventId) => {
    try {
      const responseMessage = await removeFromWishlist(eventId);
      
      // After a successful API call, update the UI by removing the item from the state
      setWishlist(currentWishlist => 
        currentWishlist.filter(event => event.eventId !== eventId)
      );

      // Show the success message from the backend
      alert(responseMessage || "Event removed from wishlist!"); 

    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      const errorMessage = err.response?.data?.message || 'Could not remove item.';
      alert(`Error: ${errorMessage}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-400"></div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>;
    }
    if (wishlist.length === 0) {
      return (
        <div className="text-center bg-slate-800 p-12 rounded-lg border-2 border-dashed border-slate-700">
          <h2 className="text-2xl font-bold text-white">Your Wishlist is Empty</h2>
          <p className="text-slate-400 mt-2">Click the heart icon on an event to save it for later.</p>
          <Link to="/dashboard" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition">
            Find Events
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-8">
        {wishlist.map(event => (
          // ✅ FIX: Use the unique 'eventId' from the backend for the key prop
          <WishlistEventCard 
            key={event.eventId} 
            event={event} 
            onRemove={handleRemoveFromWishlist} // Pass the remove function
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">My Wishlist</h1>
        <p className="text-slate-400 mb-12">A collection of events you're interested in.</p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default MyWishlistPage;
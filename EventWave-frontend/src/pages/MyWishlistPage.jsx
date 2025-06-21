import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyWishlist } from '../api/eventService';
import WishlistEventCard from '../components/WishlistEventCard'; // <-- Use our new component

const MyWishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await getMyWishlist();
        setWishlist(data);
      } catch (err) {
        setError("Could not fetch your wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = (eventId) => {
    console.log(`Removing event ID: ${eventId} from wishlist.`);
    // **API HOOK:** Here you would call your API to remove the item.
    // await removeFromWishlistAPI(eventId);

    // Update the UI optimistically by filtering out the removed item
    setWishlist(currentWishlist => currentWishlist.filter(event => event.id !== eventId));
    
    alert(`Event removed from wishlist! (UI only for now)`);
  };

  const renderContent = () => {
    if (loading) {
      // A more visual loader
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
      // Use a single-column layout with spacing
      <div className="flex flex-col gap-8">
        {wishlist.map(event => (
          <WishlistEventCard 
            key={event.id} 
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
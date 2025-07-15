import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegisteredEvents, unregisterFromEvent } from '../api/eventService'; 
// Import the new function to get the user's profile
import { getUserProfile } from '../api/userService'; // Assuming your file is named userService.js
import RegisteredEventCard from '../components/RegisteredEventCard';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This new state variable will hold the numerical userId after we fetch it.
  const [currentUserId, setCurrentUserId] = useState(null);

  // useEffect now fetches both the user profile and their registered events.
  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // STEP 1: Fetch the user's profile to get their numerical ID.
        // We call the `getUserProfile` function you provided.
        const userProfile = await getUserProfile();

        // Validate that we got the profile and it has an ID.
        if (!userProfile || !userProfile.userId) { // Use the correct property name here
  throw new Error("Could not retrieve user profile or user ID from the server.");
}
setCurrentUserId(userProfile.userId); // And use the correct property name here
        // Save the numerical ID into our state variable for later use.
        setCurrentUserId(userProfile.userId);

        // STEP 2: Fetch the user's registered events (your original logic).
        const registeredEvents = await getMyRegisteredEvents(); 
        setRegistrations(registeredEvents);

      } catch (err) {
        console.error("Failed to load page data:", err);
        // Provide a clear error message to the user.
        setError(err.response?.data?.message || err.message || "Could not load your registration data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    
    loadPageData();
  }, []); // This empty dependency array means the effect runs once when the component mounts.

  
  // This function now uses the 'currentUserId' from the state.
  const handleUnregister = async (eventId) => {
    // A quick check to make sure we have the userId before trying to unregister.
    if (!currentUserId) {
      alert("Error: Your user ID is not available. The page may not have loaded correctly.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to unregister from this event?")) {
      return;
    }
    
    try {
      // Create the data object with the numerical userId from our state.
      const unregistrationData = {
        userId: currentUserId, 
        eventId: eventId,
      };

      console.log("Sending unregister request with data:", unregistrationData);
      
      // Call the unregister API service.
      await unregisterFromEvent(unregistrationData);
      
      // If successful, update the UI to remove the card instantly.
      setRegistrations(currentRegistrations =>
        currentRegistrations.filter(event => event.eventId !== eventId)
      );
      alert("Successfully unregistered from the event.");

    } catch (err) {
      console.error("Unregistration failed:", err);
      alert(`Error: ${err.response?.data?.message || 'Could not unregister.'}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-slate-300">Loading your events...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400 font-semibold">{error}</p>;
    }
    if (registrations.length === 0) {
      return (
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white">Nothing here yet!</h2>
          <p className="text-slate-400 mt-2">You haven't registered for any upcoming events.</p>
          <Link to="/dashboard" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition">
            Explore Events
          </Link>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {registrations.map(event => (
          <RegisteredEventCard 
            key={event.eventId} 
            event={event} 
            onUnregister={handleUnregister} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-2">My Registered Events</h1>
      <p className="text-slate-400 mb-8">Here are all the events you're signed up for.</p>
      {renderContent()}
    </div>
  );
};

export default MyRegistrationsPage;
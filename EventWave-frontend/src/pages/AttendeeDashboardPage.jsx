import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { getEvents, searchEvents } from '../api/eventService'; // Import both functions

const AttendeeDashboardPage = () => {
  const [allEvents, setAllEvents] = useState([]); // To hold the original full list
  const [filteredEvents, setFilteredEvents] = useState([]); // To hold the displayed list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial fetch for all events
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        setAllEvents(data);
        setFilteredEvents(data); // Initially, show all events
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Could not load events. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  // Handle search logic
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    if (!searchTerm.trim()) {
      // If search is empty, show all events again
      setFilteredEvents(allEvents);
      return;
    }
    
    setLoading(true); // Show loading indicator during search
    try {
      const searchResults = await searchEvents(searchTerm);
      setFilteredEvents(searchResults);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-slate-300 text-xl">Loading events...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>;
    }
    if (filteredEvents.length === 0) {
        return <p className="text-center text-slate-400">No events found matching your criteria.</p>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* ✅ FIX: The key prop should use a unique ID from the data, like event.eventId */}
        {filteredEvents.map(event => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header and Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Browse Upcoming Events</h1>
        <p className="text-slate-400 mt-2 text-lg">Find your next experience.</p>
      </div>
      
      {/* Search Bar Section */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for events by title..."
            className="w-full px-5 py-3 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="absolute top-1/2 right-2 -translate-y-1/2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-500">
            Search
          </button>
        </div>
      </form>
      
      {/* Events Grid */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AttendeeDashboardPage;
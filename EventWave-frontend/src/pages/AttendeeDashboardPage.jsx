import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
// Import all our API functions, including the new search one
import { 
  getAllEvents, 
  getEventsByCategory, 
  getEventsByLocation, 
  getEventsByDateRange,
  searchEventsByTitle,
} from '../api/eventService'; 

const CATEGORIES = ['All', 'TECHNOLOGY', 'MUSIC', 'ARTS', 'BUSINESS', 'SPORTS'];

const AttendeeDashboardPage = () => {
  const [allEvents, setAllEvents] = useState([]); // Master list
  const [displayedEvents, setDisplayedEvents] = useState([]); // List to render
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for all filter inputs, including the new title search
  const [filters, setFilters] = useState({
    title: '',
    category: 'All',
    location: '',
    startDate: '',
    endDate: '',
  });

  // Initial fetch for all events
  useEffect(() => {
    const fetchInitialEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllEvents();
        setAllEvents(data);
        setDisplayedEvents(data);
      } catch (err) {
        console.error("Error fetching initial events:", err);
        setError("Could not load events. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialEvents();
  }, []);

  // Handler for text inputs and dropdowns
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- Handlers for search/filter actions ---
  const executeSearch = async (apiCall, failureMessage) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall();
      setDisplayedEvents(data);
    } catch (err) {
      setError(failureMessage);
      setDisplayedEvents([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTitleSearch = (e) => {
    e.preventDefault();
    if (!filters.title.trim()) return;
    executeSearch(
      () => searchEventsByTitle(filters.title),
      `Failed to find events matching "${filters.title}"`
    );
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    handleFilterChange(e); // Update state first
    if (category === 'All') {
      setDisplayedEvents(allEvents);
    } else {
      executeSearch(
        () => getEventsByCategory(category),
        `Failed to fetch events for category: ${category}`
      );
    }
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (!filters.location.trim()) return;
    executeSearch(
      () => getEventsByLocation(filters.location),
      `Failed to find events for location: ${filters.location}`
    );
  };

  const handleDateRangeSearch = (e) => {
    e.preventDefault();
    if (!filters.startDate || !filters.endDate) {
      alert("Please select both a start and end date.");
      return;
    }
    executeSearch(
      () => getEventsByDateRange(filters.startDate, filters.endDate),
      "Failed to fetch events for the selected date range."
    );
  };
  
  const clearFilters = () => {
    setDisplayedEvents(allEvents);
    setFilters({ title: '', category: 'All', location: '', startDate: '', endDate: '' });
    setError(null);
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-slate-300 text-xl py-10">Loading events...</p>;
    if (error) return <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>;
    if (displayedEvents.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-slate-400 text-lg">No events found matching your criteria.</p>
          <button onClick={clearFilters} className="mt-4 text-indigo-400 hover:text-indigo-300">Clear all filters</button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* ✅ FIX: The key prop uses event.id, which should be unique */}
        {displayedEvents.map(event => <EventCard key={event.eventId} event={event} />)}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">Find Your Next Experience</h1>
        <p className="text-slate-400 mt-2 text-lg">Explore a universe of events tailored for you.</p>
      </div>
      
      {/* --- REDESIGNED COMPACT FILTER BAR --- */}
      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 mb-12 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
          {/* Title Search */}
          <form onSubmit={handleTitleSearch} className="lg:col-span-2">
            <div className="relative">
              <input type="search" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Search by event title..." className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </form>
          
          {/* Category Filter */}
          <select name="category" value={filters.category} onChange={handleCategoryChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          
          {/* Location Filter */}
          <form onSubmit={handleLocationSearch}>
            <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="Filter by location..." className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </form>

          {/* Reset Button */}
          <button onClick={clearFilters} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">
            Reset Filters
          </button>
        </div>

        {/* Date Range Filter (optional - can be a modal or separate section if too complex for the bar) */}
        {/* <form onSubmit={handleDateRangeSearch} className="mt-4 flex items-center gap-2 justify-center"> ... </form> */}
      </div>
      
      <div>{renderContent()}</div>
    </div>
  );
};

export default AttendeeDashboardPage;
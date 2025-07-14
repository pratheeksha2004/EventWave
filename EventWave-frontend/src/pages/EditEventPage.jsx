import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganizerEventById, updateEvent } from '../api/eventService'; 

const EditEventPage = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Your logic remains unchanged
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const event = await getOrganizerEventById(eventId);
        const [datePart, timePart] = event.dateTime.split('T');
        setFormData({
          title: event.title,
          description: event.description,
          date: datePart,
          time: timePart.substring(0, 5),
          location: event.location,
          capacity: event.capacity,
          price: event.price,
          category: event.category,
        });
      } catch (err) {
        console.error("Failed to fetch event data:", err);
        setError("Could not load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const eventDataForApi = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      capacity: parseInt(formData.capacity, 10),
      price: parseFloat(formData.price),
      category: formData.category.toUpperCase(),
      dateTime: `${formData.date}T${formData.time}:00`,
    };
    try {
      await updateEvent(eventId, eventDataForApi);
      alert('Event updated successfully!');
      navigate('/organizer-dashboard');
    } catch (err) {
      console.error("Failed to update event:", err);
      setError(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading event details...</div>;
  }

  // Your JSX structure remains the same, only classNames are added
  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Edit Event</h1>
      <p className="text-slate-400 mb-8">Update the details for your event below.</p>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Event Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required
                 className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Event Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleInputChange} required
                      className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleInputChange} required
                  className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select a category...</option>
            <option value="TECHNOLOGY">Technology</option>
            <option value="MUSIC">Music</option>
            <option value="SPORTS">Sports</option>
            <option value="ARTS">Arts</option>
            <option value="BUSINESS">Business</option>
            <option value="COMMUNITY">Community</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-1">Time</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required
                   className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        
        {/* You would add the other form fields (location, capacity, price) here with the same styling */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required
                 className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-slate-300 mb-1">Capacity</label>
                <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleInputChange} required
                       className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">Price (USD)</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required
                       className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
        </div>
        
        {error && <p className="text-sm text-center text-red-400">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSaving} 
                  className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
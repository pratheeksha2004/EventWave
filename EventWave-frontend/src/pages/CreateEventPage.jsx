import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/eventService';

// Reusable FormField component - no changes needed.
const FormField = ({ id, label, type, placeholder, value, onChange, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input type={type} id={id} name={id} value={value} onChange={onChange} placeholder={placeholder}
           className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
           required={required} />
  </div>
);

const CreateEventPage = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // --- Data Transformation ---
    const eventDataForApi = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      capacity: parseInt(formData.capacity, 10),
      price: parseFloat(formData.price),
      
      // ✅ FIX: The category value is now taken directly from the state, 
      // which will be an uppercase string like "TECHNOLOGY" from the updated dropdown.
      category: formData.category,
      
      dateTime: `${formData.date}T${formData.time}:00`,
    };

    console.log("Submitting to API:", eventDataForApi);

    try {
      await createEvent(eventDataForApi);
      alert('Event created successfully!');
      navigate('/organizer-dashboard');
    } catch (err) {
      console.error("Failed to create event:", err);
      // More specific error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Create a New Event</h1>
      <p className="text-slate-400 mb-8">Fill out the details below to publish your event.</p>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        <FormField id="title" label="Event Title" type="text" placeholder="e.g., Annual Tech Conference" value={formData.title} onChange={handleInputChange} />
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Event Description</label>
          <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleInputChange}
                    placeholder="Tell your attendees all about the event..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required></textarea>
        </div>

        {/* ✅ FIX: Updated the Category dropdown with all options from the backend error log */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleInputChange} required
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select a category...</option>
            <option value="BUSINESS">Business</option>
            <option value="MUSIC">Music</option>
            <option value="FOOD_DRINK">Food & Drink</option>
            <option value="FASHION">Fashion</option>
            <option value="OUTDOOR">Outdoor</option>
            <option value="SPORTS">Sports</option>
            <option value="ARTS">Arts</option>
            <option value="EDUCATION">Education</option>
            <option value="HEALTH">Health</option>
            <option value="TECHNOLOGY">Technology</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="date" label="Date" type="date" value={formData.date} onChange={handleInputChange} />
          <FormField id="time" label="Time" type="time" value={formData.time} onChange={handleInputChange} />
        </div>

        <FormField id="location" label="Location or Venue" type="text" placeholder="e.g., City Convention Center" value={formData.location} onChange={handleInputChange} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="capacity" label="Capacity (Max Attendees)" type="number" placeholder="e.g., 150" value={formData.capacity} onChange={handleInputChange} />
          <FormField id="price" label="Price (USD)" type="number" placeholder="Enter 0 for a free event" value={formData.price} onChange={handleInputChange} />
        </div>

        {error && <p className="text-sm text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
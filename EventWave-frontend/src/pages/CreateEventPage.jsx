import { useState } from 'react';

// A reusable component for form fields to keep our code clean
// No changes needed here, it's already good.
const FormField = ({ id, label, type, placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id} // The 'name' attribute is crucial for the single handler
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
);

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
  });

  // --- FIX #1: ONE SINGLE CHANGE HANDLER ---
  // This function can now handle any input, textarea, or select.
  // It uses the `name` attribute of the form element to know which piece of state to update.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating event with data:", formData);
    alert('Event created successfully! (UI only)');
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Create a New Event</h1>
      <p className="text-slate-400 mb-8">Fill out the details below to publish your event.</p>
      
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        <FormField 
            id="title" 
            label="Event Title" 
            type="text" 
            placeholder="e.g., Annual Tech Conference" 
            value={formData.title} 
            onChange={handleInputChange} 
        />
        
        {/* --- FIX #2: THE TEXTAREA NOW USES THE SAME HANDLER --- */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
            Event Description
          </label>
          <textarea
            id="description"
            name="description" // Make sure 'name' matches the state property
            rows="4"
            value={formData.description}
            onChange={handleInputChange} // Use the single, smart handler
            placeholder="Tell your attendees all about the event..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          ></textarea>
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

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 transform hover:scale-105"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
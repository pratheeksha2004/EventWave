import { useState, useEffect } from 'react';
// ✅ Import the REAL API functions
import { getUserProfile, updateUserProfile } from '../api/userService';

const ProfilePage = () => {
  // ✅ FIX: The state now matches the backend's data structure
  const [profile, setProfile] = useState({ 
    userId: '', 
    userName: '', 
    email: '' 
  });
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        // Set the state with the data received from the API
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load your profile. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // Runs once on page load

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess('');
    try {
      // ✅ FIX: The `profile` state object now has the correct structure 
      // { userId, userName, email } that the backend API expects.
      const response = await updateUserProfile(profile);
      setSuccess(response.message || "Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading your profile...</div>;
  }
  
  return (
    <div className="container mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
      <p className="text-slate-400 mb-8">View and edit your personal information.</p>

      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-lg shadow-xl space-y-6">
        {/* ✅ FIX: The form fields now use 'userName' instead of 'name' */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
          <input
            type="text"
            id="userName"
            name="userName" // This must match the state key
            value={profile.userName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange} // Allow email to be edited as per the backend requirement
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* We don't need to show userId or role as they are not editable */}
        
        {success && <p className="text-sm text-center text-green-400">{success}</p>}
        {error && <p className="text-sm text-center text-red-400">{error}</p>}
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold py-2 px-6 rounded-lg hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
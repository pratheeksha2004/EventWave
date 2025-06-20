import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import { register } from '../api/authService'; // <-- IMPORT our API function

const RegisterPage = () => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '', // Default role is empty
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      setError('Please select a role.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // --- API Call Placeholder ---
      const responseData = await register(formData);
      console.log('Registration Successful:', responseData);
      setSuccess(true); // Show success message
      // **NEXT STEPS:**
      // Typically, you redirect to the login page after a successful registration.
      // navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log In"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Success Message */}
        {success && (
          <p className="text-sm text-green-400 text-center bg-green-900/50 p-3 rounded-md">
            Registration successful! Please proceed to the login page.
          </p>
        )}

        {/* Full Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
          <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Jane Doe" />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
          <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
        </div>
        
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
          <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
        </div>

        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300">I want to</label>
          <select id="role" name="role" required value={formData.role} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select an option...</option>
            <option value="USER">Attend events</option>
            <option value="ORGANIZER">Organize events</option>
          </select>
        </div>

        {/* Error Display */}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        {/* Submit Button */}
        <div>
          <button type="submit" disabled={loading || success} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
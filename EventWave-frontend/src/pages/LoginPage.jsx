import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/authService'; // <-- We now import the API function directly

const LoginPage = () => {
  // --- Local State Management ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // This component now owns the loading state
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook to redirect the user after login

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from reloading the page
    setLoading(true);   // Start the loading indicator
    setError(null);     // Clear any previous errors

    try {
      // **THIS IS THE API HOOK**
      // We call the login function from our service file.
      // For now, it will return a mock response.
      const responseData = await login(formData);

      console.log('Login Successful, backend returned:', responseData);
      
      // On success, redirect the user to their dashboard.
      navigate('/dashboard');

    } catch (err) {
      // If the API call fails, we catch the error here.
      console.error('Login failed:', err);
      // Set a user-friendly error message to display in the UI.
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      // This runs whether the login succeeded or failed.
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <AuthLayout
      title="Login to Your Account"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign Up"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading} // Disable input when loading
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading} // Disable input when loading
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

        {/* Error Display */}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Call the login service, which should return the raw token string.
      const token = await login(formData);

      // --- THIS IS THE FIX ---
      // 2. Save the token you received directly into localStorage.
      //    Use the 'token' variable, not a non-existent 'response' variable.
      localStorage.setItem('token', token);

      // 3. Now, the rest of your logic will work correctly.
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role; // Make sure your token has a 'role' claim
      
      console.log('Login successful. Decoded Token:', decodedToken);
      
      // 4. Redirect based on the role.
      if (userRole === 'ORGANIZER') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/dashboard'); // For attendees
      }

    } catch (err) {
      // This will now correctly catch actual API or credential errors.
      console.error('Login failed:', err);
      // Use a more generic message for the user.
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="Enter your username"
          />
        </div>
        
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
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>
        
        {/* Updated error display for better user feedback */}
        {error && (
          <div className="bg-red-800/40 border border-red-700 text-red-300 px-4 py-3 rounded-md text-center">
            <p className="text-sm">{error}</p>
          </div>
        )}

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
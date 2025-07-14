import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Good, you need this to read the token
import AuthLayout from '../components/AuthLayout';
import { login } from '../api/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  // Using 'username' here is correct if your backend expects a username
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
      const token = await login(formData); // Assume authService handles the API call

      // This is the most important part for protected routes to work
      localStorage.setItem('token', token);

      // Decode the token to find the user's role for redirection
      const decodedToken = jwtDecode(token);
       const userRole = decodedToken.role; // Assumes the role claim is named 'role'
       console.log('Decoded Token:', decodedToken);
      // Redirect based on the role
      if (userRole === 'ORGANIZER') {
        navigate('/organizer-dashboard');
      } else {
        navigate('/dashboard'); // For attendees ('USER' role)
      }

    } catch (err) {
       console.error('Login failed:', err); 
      setError(err.response?.data || 'Login failed. Please check your credentials.');
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
        {/* The form correctly uses 'username' */}
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
        
        {/* Password field is standard */}
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
        
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
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
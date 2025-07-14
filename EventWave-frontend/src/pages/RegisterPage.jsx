import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { register } from '../api/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // <-- CHANGE: from 'name' to 'username'
    email: '',
    password: '',
    role: 'USER', 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // The `formData` now correctly has a `username` property to match the backend
      const responseToken = await register(formData);
      console.log('Registration Successful, token received:', responseToken);
      setSuccess(true); 

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration Error:', err);
      // The backend sends a simple string message on error
      setError(err.response?.data || 'Registration failed. Please try again.');
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
        {success && (
          <p className="text-sm text-green-400 text-center bg-green-900/50 p-3 rounded-md">
            Registration successful! Redirecting to login...
          </p>
        )}

        {/* --- CHANGE: This field now maps to 'username' --- */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
          <input 
            id="username" 
            name="username" // <-- The 'name' attribute is now 'username'
            type="text" 
            required 
            value={formData.username} 
            onChange={handleInputChange} 
            className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Choose a unique username"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
          <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
          <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300">I want to</label>
          <select id="role" name="role" required value={formData.role} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="USER">Attend events</option>
            <option value="ORGANIZER">Organize events</option>
          </select>
        </div>
        
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
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
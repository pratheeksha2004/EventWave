import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

// This is our new, powerful Navbar for logged-in users
const AppNavbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // Don't search if the bar is empty
    
    console.log(`Searching for: ${searchTerm}`);
    // **API HOOK:** This is where you'll trigger the search.
    // You'll likely navigate to a search results page:
    // navigate(`/search?query=${searchTerm}`);
    alert(`Search functionality for "${searchTerm}" is ready for API hook!`);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // **API HOOK:**
    // 1. Call your logout API endpoint if necessary.
    // 2. Clear any user token from localStorage.
    // 3. Redirect to the login page.
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/dashboard" className="text-3xl font-bold text-white">
          Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">Wave</span>
        </Link>

        {/* Middle: Search Bar */}
       

        {/* Right Side: Navigation & User Menu */}
        <nav className="flex items-center space-x-6">
          <Link to="/my-registrations" className="text-sm font-medium text-slate-300 hover:text-indigo-400">
            My Registrations
          </Link>
          <Link to="/my-wishlist" className="text-sm font-medium text-slate-300 hover:text-indigo-400">
            My Wishlist
          </Link>

          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center hover:ring-2 hover:ring-indigo-500">
              {/* Profile Icon SVG */}
              <svg className="h-6 w-6 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform-gpu">
              
              <Link to="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50">Edit Profile</Link>
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-slate-700/50">
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};


const AppLayout = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <AppNavbar /> {/* Use our new, powerful navbar */}
      <main>
        <Outlet /> {/* Renders the current page (e.g., DashboardPage) */}
      </main>
    </div>
  );
};

export default AppLayout;
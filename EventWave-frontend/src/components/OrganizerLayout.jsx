import { Outlet, Link, useNavigate } from 'react-router-dom';

// A dedicated Navbar just for Organizers with the new Feedback/Notification Icon
const OrganizerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // A more complete logout would also clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    console.log("Logging out...");
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-8">
          <Link to="/organizer-dashboard" className="text-3xl font-bold text-white">
            Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">Wave</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/organizer-dashboard" className="text-sm font-medium text-slate-300 hover:text-white">
              My Dashboard
            </Link>
            <Link to="/create-event" className="text-sm font-medium text-slate-300 hover:text-white">
              Create Event
            </Link>
          </div>
        </div>

        {/* Right Side: Icons & Profile Menu */}
        <nav className="flex items-center space-x-4">
          
          {/* --- NEW: Notification/Feedback Icon --- */}
          <Link 
            to="/organizer/feedback"
            className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white"
            title="View All Feedback"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Link>
          
          {/* Profile Dropdown */}
          <div className="relative group">
            <button className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center hover:ring-2 hover:ring-indigo-500">
              <svg className="h-6 w-6 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
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

// The main layout component for the organizer section (no changes here)
const OrganizerLayout = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <OrganizerNavbar />
      <main>
        <Outlet /> {/* This renders the current nested route */}
      </main>
    </div>
  );
};

export default OrganizerLayout;
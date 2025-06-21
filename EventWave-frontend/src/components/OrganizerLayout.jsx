import { Outlet, Link, useNavigate } from 'react-router-dom';

// A dedicated Navbar just for Organizers
const OrganizerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Side: Logo & Dashboard Link */}
        <div className="flex items-center gap-8">
          <Link to="/organizer-dashboard" className="text-3xl font-bold text-white">
            Event<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">Wave</span>
          </Link>
          <Link to="/organizer-dashboard" className="text-sm font-medium text-slate-300 hover:text-white">
            My Dashboard
          </Link>
        </div>

        {/* Right Side: Create Button & Profile Menu */}
        <nav className="flex items-center space-x-6">
          
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

// The main layout component for the organizer section
const OrganizerLayout = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300">
      <OrganizerNavbar />
      <main>
        <Outlet /> {/* Renders the current organizer page */}
      </main>
    </div>
  );
};

export default OrganizerLayout;
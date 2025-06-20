import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-white">
          Event
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">
            Wave
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/#features" className="text-slate-300 hover:text-indigo-400 transition-colors duration-300">Features</a>
          <a href="/#about" className="text-slate-300 hover:text-indigo-400 transition-colors duration-300">About Us</a>
        </nav>

        {/* Login and Sign Up Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors duration-300">
            Login
          </Link>
          <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-500 transition-all duration-300 font-medium shadow-lg shadow-indigo-600/30">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
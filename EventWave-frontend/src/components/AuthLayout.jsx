import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, footerText, footerLink, footerLinkText }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo linking back to the homepage */}
        <Link to="/" className="block text-center text-4xl font-bold text-white mb-8">
          Event
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">
            Wave
          </span>
        </Link>

        {/* The main form card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg shadow-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white text-center mb-6">{title}</h2>
          {children}
        </div>

        {/* Footer link to switch between login/signup */}
        <p className="text-center text-slate-400 mt-6">
          {footerText}{' '}
          <Link to={footerLink} className="font-medium text-indigo-400 hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
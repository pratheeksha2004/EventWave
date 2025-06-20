import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// A high-quality, vibrant image for the background
const heroImageUrl = "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const HomePage = () => {
  return (
    <div className="bg-slate-900 text-slate-300">
      <Navbar />

      <main>
        {/* --- Hero Section --- */}
        {/* This section now uses the image as a full background */}
        <section
          className="relative flex items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImageUrl})` }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Centered content */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Connect Your Community, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">
                One Event at a Time.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-200 max-w-2xl mx-auto">
              EventWave is the ultimate platform for communities to thrive. Find your next experience or create your own and bring people together.
            </p>
            <Link
              to="/register"
              className="mt-10 inline-block bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-indigo-600/50"
            >
              Get Started Now
            </Link>
          </div>
        </section>

        {/* --- Features Section --- */}
        {/* This new section adds visual interest and breaks up the page */}
        <section id="features" className="py-20 bg-slate-800">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Why Choose EventWave?</h2>
                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Everything you need to manage community events in one place.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature Card 1 */}
                    <div className="bg-slate-900/50 p-8 rounded-lg text-center transform hover:scale-105 hover:bg-slate-700/50 transition-all duration-300">
                        <div className="text-indigo-400 mb-4">
                            {/* SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Effortless Creation</h3>
                        <p className="text-slate-400">Organizers can set up an event page with all the details in minutes.</p>
                    </div>
                    {/* Feature Card 2 */}
                     <div className="bg-slate-900/50 p-8 rounded-lg text-center transform hover:scale-105 hover:bg-slate-700/50 transition-all duration-300">
                        <div className="text-fuchsia-500 mb-4">
                            {/* SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Powerful Discovery</h3>
                        <p className="text-slate-400">Attendees can easily search, filter, and find events that match their interests.</p>
                    </div>
                    {/* Feature Card 3 */}
                     <div className="bg-slate-900/50 p-8 rounded-lg text-center transform hover:scale-105 hover:bg-slate-700/50 transition-all duration-300">
                        <div className="text-indigo-400 mb-4">
                            {/* SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Seamless Registration</h3>
                        <p className="text-slate-400">One-click registration and easy ticket management for all users.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* --- About Us Section --- */}
        <section id="about" className="py-20 bg-slate-900">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">About Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 mx-auto mt-4 mb-8"></div>
            <p className="max-w-3xl mx-auto text-slate-400 text-lg">
              We believe in the power of shared experiences. EventWave was founded to provide a simple, elegant, and powerful tool for organizers to host events and for attendees to discover them. We're passionate about bringing people together.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
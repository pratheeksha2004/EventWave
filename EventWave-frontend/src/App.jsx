import { Routes, Route } from 'react-router-dom';

// Page Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AttendeeDashboardPage from './pages/AttendeeDashboardPage';
import AppLayout from './components/AppLayout'; // Our simple layout

// Placeholder pages for development
const MyRegistrationsPage = () => <div className="p-8 text-white text-3xl">My Registered Events Page</div>;
const MyWishlistPage = () => <div className="p-8 text-white text-3xl">My Wishlist Page</div>;
const ProfilePage = () => <div className="p-8 text-white text-3xl">Edit Profile Page</div>;

// ... inside the <Routes>

function App() {
  return (
    <Routes>
      {/* Public pages that don't need the dashboard navbar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* "App" pages that will share the same dashboard layout */}
      <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<AttendeeDashboardPage />} />
    <Route path="/my-registrations" element={<MyRegistrationsPage />} />
    {/* ADD THESE TWO: */}
    <Route path="/my-wishlist" element={<MyWishlistPage />} />
    <Route path="/profile" element={<ProfilePage />} />
</Route>
    </Routes>
  );
}

export default App;
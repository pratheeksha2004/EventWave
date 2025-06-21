import { Routes, Route } from 'react-router-dom';

// --- Layout Components ---
import AppLayout from './components/AppLayout';
import OrganizerLayout from './components/OrganizerLayout';

// --- Public Page Components ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Attendee Page Components ---
import AttendeeDashboardPage from './pages/AttendeeDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import MyWishlistPage from './pages/MyWishlistPage';

// --- Organizer Page Components ---
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ViewAttendeesPage from './pages/ViewAttendeesPage';

// --- Shared or Placeholder Page Components ---
// These can be replaced with real components later.
const ProfilePage = () => <div className="p-8 text-white text-3xl">Edit Profile Page</div>;
const EditEventPage = () => <div className="p-8 text-white text-3xl">Edit Event Page</div>;


function App() {
  return (
    <Routes>
      {/* --- Public Routes (No Layout) --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- ATTENDEE Routes (using AppLayout) --- */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<AttendeeDashboardPage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/my-wishlist" element={<MyWishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* --- ORGANIZER Routes (using OrganizerLayout) --- */}
      <Route element={<OrganizerLayout />}>
        <Route path="/organizer-dashboard" element={<OrganizerDashboardPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/events/:id/edit" element={<EditEventPage />} />
        <Route path="/events/:id/attendees" element={<ViewAttendeesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
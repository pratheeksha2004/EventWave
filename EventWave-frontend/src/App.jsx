import { Routes, Route } from 'react-router-dom';

// --- Layout Components ---
import AppLayout from './components/AppLayout';
import OrganizerLayout from './components/OrganizerLayout';

// --- Public Page Components ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventDetailsPage from './pages/EventDetailsPage'; // Import the new page
// --- Attendee Page Components ---
import AttendeeDashboardPage from './pages/AttendeeDashboardPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import MyWishlistPage from './pages/MyWishlistPage';
import AllFeedbackPage from './pages/AllFeedbackPage'; // Import the new page
// --- Organizer Page Components ---
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import ViewAttendeesPage from './pages/ViewAttendeesPage';
// ✅ FIX: Import the real EditEventPage component
import EditEventPage from './pages/EditEventPage'; 

// --- Shared Page Component ---
import ProfilePage from './pages/ProfilePage';


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
        {/* Profile page can be shared across layouts if needed */}
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
      </Route>

      {/* --- ORGANIZER Routes (using OrganizerLayout) --- */}
      <Route element={<OrganizerLayout />}>
        <Route path="/organizer-dashboard" element={<OrganizerDashboardPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        {/* ✅ FIX: This route now correctly points to the imported EditEventPage component */}
        <Route path="/events/:id/edit" element={<EditEventPage />} />
         <Route path="organizer/feedback" element={<AllFeedbackPage />} />
        <Route path="/events/:id/attendees" element={<ViewAttendeesPage />} />

      </Route>
    </Routes>
  );
}

export default App;
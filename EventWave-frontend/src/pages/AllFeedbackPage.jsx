import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import the correct API functions
import { getMyOrganizerEvents } from '../api/eventService'; 
import { getReviewsForOrganizerEvent } from '../api/reviewService'; // <-- Use the new organizer-specific function

// Reusable component to display a single feedback item
const FeedbackItem = ({ review }) => {
  const formattedDate = new Date(review.createdAt || review.date).toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  return (
    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <Link to={`/events/${review.eventId}`} className="font-bold text-indigo-400 hover:underline">
          {review.eventTitle || `Feedback for Event #${review.eventId}`}
        </Link>
        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
      <blockquote className="border-l-4 border-slate-600 pl-4">
        <p className="text-slate-300 italic">"{review.feedback}"</p>
        <footer className="text-sm text-slate-400 mt-2">- {review.userName || 'Anonymous'}</footer>
      </blockquote>
    </div>
  );
};

const AllFeedbackPage = () => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllFeedback = async () => {
      try {
        setLoading(true);
        setError(null);

        // STEP 1: Get the organizer's events.
        const organizerEvents = await getMyOrganizerEvents();
        
        if (organizerEvents.length === 0) {
          setAllFeedback([]);
          return;
        }

        // STEP 2: Create promises to fetch reviews for each event.
        const reviewPromises = organizerEvents.map(event => {
          // --- FIX #1: Use the correct ID property from the event object ---
          // It's likely `eventId`, not `id`. We check for both to be safe.
          const eventId = event.eventId || event.id;

          // --- FIX #2: Call the new, correct API function for organizers ---
          return getReviewsForOrganizerEvent(eventId)
            .then(reviews => reviews.map(review => ({ 
                ...review, 
                eventTitle: event.title, 
                // Ensure eventId is on the review object if it's not already
                eventId: eventId 
            })));
        });

        const results = await Promise.all(reviewPromises);
        const flattenedFeedback = results.flat();
        const sortedFeedback = flattenedFeedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setAllFeedback(sortedFeedback);

      } catch (err) {
        console.error("Failed to fetch all feedback:", err);
        setError("Could not load your feedback. Please check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllFeedback();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="text-center text-slate-300">Loading all feedback...</p>;
    if (error) return <p className="text-center text-red-400">{error}</p>;
    if (allFeedback.length === 0) {
      return (
        <div className="text-center bg-slate-800/50 p-8 rounded-lg">
          <h2 className="text-xl font-bold text-white">No Feedback Yet</h2>
          <p className="text-slate-400 mt-1">Attendees have not left any feedback on your events.</p>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        {allFeedback.map(review => (
          <FeedbackItem key={review.reviewId} review={review} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">All Event Feedback</h1>
        <p className="text-slate-400 mt-2">A stream of all feedback received across all your events.</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default AllFeedbackPage;
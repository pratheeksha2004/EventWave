import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../api/eventService';
// Import the review service functions
import { getReviewsForEvent, postReviewForEvent } from '../api/reviewService'; 
import { placeholderImages } from '../assets/image-placeholder';

//==================================================================
//  COMPONENT: StarRating (for visual flair - display only)
//==================================================================
const StarRating = ({ rating }) => {
  // ... (This component is correct, no changes needed)
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg key={index} className={`h-5 w-5 ${index < rating ? 'text-amber-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};


//==================================================================
//  COMPONENT: ReviewCard (CORRECTED to be more robust)
//==================================================================
const ReviewCard = ({ review }) => {
  const formattedDate = new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // --- FIX #1: Safely access the username ---
  // Use optional chaining (?.) to prevent a crash if 'review.user' is undefined.
  // Provide a fallback text like 'Anonymous' if the username doesn't exist.
  const username = review.user?.username || 'Anonymous User';
  
  // Use 'feedback' first, as that's what we post, but fall back to 'comment'.
  const reviewText = review.feedback || review.comment || "[No feedback provided]";

  return (
    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-white">{username}</p>
        {review.rating && <StarRating rating={review.rating} />}
      </div>
      <p className="text-slate-300 leading-relaxed mb-4">{reviewText}</p>
      <p className="text-xs text-slate-500 text-right">{formattedDate}</p>
    </div>
  );
};


//==================================================================
//  COMPONENT: AddReviewForm (UPDATED WITH STAR RATING UI)
//==================================================================
const AddReviewForm = ({ eventId, onReviewAdded }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // State for the selected rating
  const [hover, setHover] = useState(0); // State for the hover effect on stars
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Minimal validation to ensure a rating and feedback are provided
    if (rating === 0) {
        setError("Please select a star rating.");
        return;
    }
    if (!feedback.trim()) { 
        setError("Please write a comment."); 
        return; 
    }
    
    setLoading(true);
    setError(null);
    try {
      // The data payload now includes both rating and feedback
      const reviewData = { feedback: feedback, rating: rating };
      const newReview = await postReviewForEvent(eventId, reviewData);
      onReviewAdded(newReview);
      
      // Reset form fields after successful submission
      setFeedback('');
      setRating(0);

    } catch (err) {
      console.error("Failed to post review:", err);
      setError(err.response?.data?.message || "Failed to submit your review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Leave a Feedback</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* --- STAR RATING INPUT UI --- */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <button
                  type="button" // Use type="button" to prevent form submission on click
                  key={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none"
                  aria-label={`Rate ${ratingValue} out of 5 stars`}
                >
                  <svg
                    className={`h-8 w-8 cursor-pointer transition-colors duration-150 ${
                      ratingValue <= (hover || rating) ? 'text-amber-400' : 'text-slate-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
        {/* --- END OF STAR RATING UI --- */}

        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-slate-300 mb-1">Your Feedback</label>
          <textarea id="feedback" rows="4" value={feedback} onChange={(e) => setFeedback(e.target.value)} required className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tell others about your experience..."></textarea>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div>
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};


//==================================================================
//  COMPONENT: LoadingSpinner (utility)
//==================================================================
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);


//==================================================================
//  MAIN PAGE COMPONENT: EventDetailsPage
//==================================================================
const EventDetailsPage = () => {
  // ... (State and useEffect hooks remain the same, no changes needed here)
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [eventData, reviewsData] = await Promise.all([
          getEventById(eventId),
          getReviewsForEvent(eventId)
        ]);

        setEvent(eventData);
        setReviews(reviewsData);

      } catch (err) {
        console.error("Failed to fetch page data:", err);
        setError("Could not load event details. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [eventId]);

  const handleNewReview = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };
  
  // ... (formatDateTime, image logic, and DetailItem component remain the same)
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { formattedDate: 'N/A', formattedTime: '' };
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { formattedDate, formattedTime };
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 font-semibold">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500">Back to Dashboard</Link>
      </div>
    );
  }
  if (!event) return null;

  let displayImageUrl;
  if (event.imageUrl) {
    displayImageUrl = event.imageUrl;
  } else {
    const placeholderIndex = event.id % placeholderImages.length;
    displayImageUrl = placeholderImages[placeholderIndex];
  }

  const { formattedDate, formattedTime } = formatDateTime(event.dateTime);

  const DetailItem = ({ icon, label, value, subValue }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-800/60 rounded-lg">
      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-slate-700/50 text-indigo-400">{icon}</div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-bold text-white">{value}</p>
        {subValue && <p className="text-sm text-slate-400">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* --- EVENT DETAILS SECTION --- */}
      <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* ... (Event details JSX remains the same) ... */}
        <div className="relative">
          <img src={displayImageUrl} alt={event.title} className="w-full h-56 md:h-72 object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 -mt-16 sm:-mt-20 relative z-10 px-4">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">{event.title}</h1>
            <button onClick={() => alert('Registration feature to be implemented!')} className="flex-shrink-0 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
              Register Now
            </button>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Date & Time" value={formattedDate} subValue={formattedTime} />
            <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Location" value={event.location} />
            <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} label="Price" value={`$${Number(event.price).toFixed(2)}`} />
            <DetailItem icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} label="Capacity" value={`${event.capacity} people`} />
          </div>
          <div className="mt-10 pt-8 border-t border-slate-700/50">
            <h2 className="text-2xl font-bold text-white tracking-tight">About this Event</h2>
            <p className="mt-4 text-slate-300 leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>
      
      {/* --- REVIEWS SECTION --- */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-slate-700 pb-3">User Feedback</h2>
        <AddReviewForm eventId={eventId} onReviewAdded={handleNewReview} />
        <div className="mt-8 space-y-6">
          {reviews.length > 0 ? (
            // --- FIX #2: Add a robust key to the .map() call ---
            // Use review.id if available, but fall back to the index as a last resort.
            reviews.map((review, index) => (
              <ReviewCard key={review.id || index} review={review} />
            ))
          ) : (
            <div className="text-center py-8 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400">Be the first to leave feedback for this event!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
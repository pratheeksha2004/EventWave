// In src/components/AddReviewForm.jsx

import React, { useState } from 'react';
import { postReviewForEvent } from '../api/reviewService';

const AddReviewForm = ({ eventId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const reviewData = { rating, comment };
      const newReview = await postReviewForEvent(eventId, reviewData);
      
      // Call the function passed from the parent to update the review list
      onReviewAdded(newReview);

      // Reset form
      setRating(5);
      setComment('');
    } catch (err) {
      console.error("Failed to post review:", err);
      setError(err.response?.data?.message || "Failed to submit your review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  type="button"
                  key={starValue}
                  onClick={() => setRating(starValue)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`h-7 w-7 transition-colors ${starValue <= rating ? 'text-amber-400' : 'text-slate-600 hover:text-slate-500'}`}
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
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-1">Your Comment</label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell others about your experience..."
          ></textarea>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewForm;
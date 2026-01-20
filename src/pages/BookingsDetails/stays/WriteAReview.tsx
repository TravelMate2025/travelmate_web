import { useEffect, useState } from "react";
import hotelImage from "../../../assets/images/StayImage3.png";
import { BookingDetailsVerifyData } from "../../../features/stays/types";
import { getReviews, submitReview } from "../../../features/stays/api";

type props = {
  closeModal: () => void;
  bookings: BookingDetailsVerifyData | undefined;
};

const WriteAReview = ({ closeModal, bookings }: props) => {
  // State for the form inputs
  const [reviewText, setReviewText] = useState("");
  const [ratings, setRatings] = useState({
    enjoyment: 0,
    cleanliness: 0,
    value: 0,
    location: 0,
  });

  // Helper to update specific ratings
  const handleRating = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const submitAReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReview(
        bookings?.id,
        bookings?.hotel_code,
        reviewText,
        ratings.enjoyment,
        ratings.value,
      );
      console.log({ ratings, reviewText });
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };
  const StarRating = ({
    label,
    category,
  }: {
    label: string;
    category: keyof typeof ratings;
  }) => {
    return (
      <div className="space-y-1">
        <p className="text-gray-700 text-sm font-medium">{label}</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(category, star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={star <= ratings[category] ? "#FBBF24" : "none"} // Yellow for filled, none for empty
                stroke={star <= ratings[category] ? "#FBBF24" : "#9CA3AF"} // Yellow stroke if filled, Gray if empty
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        await getReviews(bookings?.id);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  },[]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999999] ">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Scrollable Content Container */}
        <form
          className="overflow-y-auto custom-scrollbar pb-6 rounded-xl"
          onSubmit={submitAReview}
        >
          {/* Header */}
          <div className="flex items-center justify-center border-b border-gray-300 pb-3 p-4  sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold text-gray-900">
              Write a Review
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-xl absolute right-5"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>

          {/* Hotel Info */}
          <div className="flex items-start justify-normal gap-4 px-6 border-b border-gray-300 py-4">
            <img
              src={hotelImage}
              alt="Hotel"
              className="w-24 h-16 rounded-md object-cover"
            />
            <div className="flex flex-col justify-between h-full">
              <h3 className="font-semibold text-gray-800">
                {bookings?.hotel_name}
              </h3>
              <p className="text-gray-500 text-sm">
                {bookings?.check_in &&
                  new Date(bookings?.check_in).toDateString()}{" "}
                -
                {bookings?.check_out &&
                  new Date(bookings?.check_out).toDateString()}
              </p>
              <p className="text-gray-800 font-medium text-sm">
                €{bookings?.total_price || "-----"}
              </p>
            </div>
          </div>

          {/* Rating Section */}
          <div className="px-6 py-4 space-y-5">
            <h4 className="text-gray-900 font-medium">
              Tap the stars to rate your overall experience
            </h4>

            <div className="space-y-4">
              <StarRating
                label="How do you enjoy your stay?"
                category="enjoyment"
              />
              <StarRating
                label="Was everything clean and tidy?"
                category="cleanliness"
              />
              <StarRating
                label="Did you get good value for your money?"
                category="value"
              />
              <StarRating label="How was the location?" category="location" />
            </div>

            {/* Review Text Area */}
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium text-gray-900 block">
                Share more about your experience
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                required
                className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#023E8A] focus:border-[#023E8A] resize-none"
              ></textarea>
              <p className="text-xs text-gray-400">
                Your review helps us improve and assists other guests in making
                informed decisions. Thank you for sharing your experience!
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 px-6 pt-2">
            <button
              onClick={closeModal}
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#023E8A] text-white font-medium hover:bg-[#023270] transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteAReview;

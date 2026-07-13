import { Rating } from "@mui/material";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { CatalogReview } from "../../types";

interface ReviewsModalProps {
  onClose: () => void;
  reviews: CatalogReview[];
}

const filterOptions = ["Most Relevant", "Highest Rated", "Lowest Rated"];

const formatReviewDate = (submittedAt?: string): string => {
  if (!submittedAt) return "";
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ReviewsModal: React.FC<ReviewsModalProps> = ({ onClose, reviews }) => {
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");

  const filteredReviews = [...reviews].sort((a, b) => {
    const aRating = a.rating ?? 0;
    const bRating = b.rating ?? 0;

    if (selectedFilter === "Highest Rated") return bRating - aRating;
    if (selectedFilter === "Lowest Rated") return aRating - bRating;
    return 0;
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviews.length
      : 0;

  return (
    <div className="fixed top-9 lg:top-24 left-1/2 transform -translate-x-1/2 bg-opacity-60 w-full h-full flex items-center justify-center ">
      <div className="bg-white rounded-lg lg:min-w-3xl h-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] p-2 md:p-6 z-[999999] lg:overflow-y-scroll ">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-4">
          <h2 className="text-xl font-bold mx-auto">All Reviews</h2>
          <button
            onClick={onClose}
            className="text-gray-600 border border-gray-300 p-1 rounded-md cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className=" max-h-full  p-2">
          {/* Star Rating */}
          <div className="mt-4 flex items-center gap-2">
            <Rating
              value={averageRating}
              precision={0.1}
              readOnly
              sx={{ color: "orange" }}
            />
            <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-gray-600">Based on {reviews.length} reviews</p>

          {/* Divider */}
          <hr className="my-4 text-gray-300" />

          {/* Filter & Search */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium">
              {filteredReviews?.length || "0"} Reviews
            </p>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border px-4 py-1 rounded-lg text-gray-600 bg-white focus:outline-blue-600"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              onChange={() => {}}
              placeholder="Search Review"
              className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg w-full md:w-[40%] focus:outline-none"
            />
          </div>

          {/* Customer Reviews */}
          <div className="space-y-6 ">
            {filteredReviews && filteredReviews.length === 0 ? (
              <div className="text-center m-auto">No Reviews found</div>
            ) : (
              filteredReviews?.map((review, index) => (
                <div
                  key={index}
                  className="p-4 border-b md:border border-gray-300 md:rounded-lg md:shadow"
                >
                  <div className="flex justify-between items-center">
                    <Rating
                      value={review?.rating ?? 0}
                      readOnly
                      sx={{ color: "orange" }}
                    />
                    <span className="text-gray-500 text-sm">
                      {formatReviewDate(review?.submittedAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{review?.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;

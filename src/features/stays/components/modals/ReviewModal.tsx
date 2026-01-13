import { Rating } from "@mui/material";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useState } from "react";

interface ReviewsModalProps {
  onClose: () => void;
  reviews: any[];
}

const ratings = [
  { category: "Cleanliness", score: 3.2 },
  { category: "Service", score: 3.7 },
  { category: "Location", score: 2.9 },
  { category: "Value for Money", score: 4.3 },
];

const filterOptions = ["Most Relevant", "Highest Rated", "Lowest Rated"];

const ReviewsModal: React.FC<ReviewsModalProps> = ({ onClose, reviews }) => {
  const [selectedFilter, setSelectedFilter] = useState("Most Relevant");

  const filteredReviews = reviews?.sort((a, b) => {
    if (selectedFilter === "Highest Rated") return b?.rating - a?.rating;
    if (selectedFilter === "Lowest Rated") return a?.rating - b?.rating;
    return 0;
  });

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
              value={4.8}
              precision={0.1}
              readOnly
              sx={{ color: "orange" }}
            />
            <span className="text-lg font-bold">4.8</span>
          </div>
          <p className="text-gray-600">Based on 80 reviews</p>

          {/* Divider */}
          <hr className="my-4 text-gray-300" />

          {/* Category Ratings */}
          <p className="mt-4 font-medium">Category Rating</p>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-2 mb-6 border border-gray-300 p-3 md:p-6 rounded-xl">
            {ratings.map((rating, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <p className="text-lg font-medium">{rating.category}</p>
                  <p className="text-lg text-right">{rating.score}</p>
                </div>

                <div className="w-full h-3 bg-gray-300 rounded-full relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#023E8A] rounded-full"
                    style={{ width: `${(rating.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

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
              onChange={(e) => {
                e.target.value.length <= 45;
              }}
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
                  key={review?.id || index}
                  className="p-4 border-b md:border border-gray-300 md:rounded-lg md:shadow"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {review?.name || "William Anderson"}
                    </p>
                    <span className="text-gray-500 text-sm">
                      Stayed in {review?.date || "Dec 2024"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <Rating
                      value={review?.rating || "4.5"}
                      readOnly
                      sx={{ color: "orange" }}
                    />
                  </div>
                  <h3 className="text-lg font-bold mt-2">
                    {review?.title || "Loved It!"}
                  </h3>
                  <p className="text-gray-600">
                    {review?.content ||
                      "I would definitely come back again. Everything was perfect!"}
                  </p>
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

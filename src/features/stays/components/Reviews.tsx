import React, { useState } from "react";
import { Rating } from "@mui/material";
import ReviewsModal from "./modals/ReviewModal";
import { useMediaQuery } from "react-responsive";

const reviews = [
  { id: 1, rating: 5, date: "March 2025", title: "Exceptional Service", content: "The staff was very welcoming and the rooms were clean.", name: "John Doe" },
  { id: 2, rating: 4.8, date: "Feb 2025", title: "Great Experience", content: "Loved the breakfast and the serene environment.", name: "Jane Smith" },
  { id: 3, rating: 4.7, date: "Jan 2025", title: "Comfortable Stay", content: "The bed was so comfortable, and the service was great!", name: "Michael Johnson" },
  { id: 4, rating: 4.5, date: "Dec 2024", title: "Nice Ambience", content: "The hotel had a beautiful ambiance, perfect for relaxation.", name: "Emily Davis" },
  { id: 5, rating: 4.9, date: "Nov 2024", title: "Top-notch Facilities", content: "Everything was clean and well-maintained. Worth every penny!", name: "Robert Wilson" },
  { id: 6, rating: 4.3, date: "Oct 2024", title: "Friendly Staff", content: "The staff were very polite and always ready to help.", name: "Sophia Brown" },
  { id: 7, rating: 4.6, date: "Sep 2024", title: "Great Food", content: "Breakfast was amazing with a lot of variety!", name: "David Martinez" },
  { id: 8, rating: 4.2, date: "Aug 2024", title: "Spacious Rooms", content: "The rooms were big and had everything I needed.", name: "Olivia Taylor" },
  { id: 9, rating: 4.8, date: "July 2024", title: "Excellent Location", content: "Close to everything I needed. Super convenient!", name: "William Anderson" },
  { id: 10, rating: 5, date: "June 2024", title: "Loved It!", content: "I would definitely come back again. Everything was perfect!", name: "Emma Thomas" }
];

const ratings = [
  { category: "Cleanliness", score: 3.2 },
  { category: "Service", score: 3.7 },
  { category: "Comfort", score: 4.1 },
  { category: "Location", score: 2.9 },
  { category: "Facilities", score: 4.6 },
];

const Reviews: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="my-10">
      {/* Title and Mobile Show All Button */}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-bold">Reviews</h2>
        {isMobile && (
          <button
            className="text-[#023E8A] font-medium"
            onClick={() => setOpenModal(true)}
          >
            Show all &gt;
          </button>
        )}
      </div>

      {/* Overall Rating */}
      {!isMobile && (
        <div className="mt-2">
          <Rating name="read-only" value={4.8} precision={0.1} readOnly sx={{ color: "orange" }} />
          <p className="text-xl font-bold">4.8</p>
          <p className="text-gray-600">Based on 80 reviews</p>
        </div>
      )}

      {/* Category Ratings */}
      {!isMobile && (
        <>
          <p className="mt-4 font-medium">Category Rating</p>
          <div className="grid grid-cols-3 gap-8 mt-2 border border-gray-300 p-6 rounded-xl">
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
        </>
      )}

      {/* Customer Reviews */}
      <div
        className={`mt-10 ${
          isMobile ? "overflow-x-auto whitespace-nowrap -mx-2 px-2" : "grid grid-cols-3 gap-6"
        }`}
      >
        {reviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className={`p-4 border border-gray-300 rounded-lg shadow bg-white ${
              isMobile ? "inline-block w-[85%] mr-4 max-w-full" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <Rating value={review.rating} readOnly sx={{ color: "orange" }} />
              <span className="text-gray-500 text-sm">{review.date}</span>
            </div>
            <h3 className="text-lg font-bold my-2">{review.title}</h3>
            <p className="text-gray-600 text-wrap line-clamp-2">{review.content}</p>
            <p className="text-sm font-medium mt-2">{review.name}</p>
          </div>
        ))}
      </div>

      {/* Show All Button for Desktop */}
      {!isMobile && (
        <div className="mt-6 flex justify-center">
          <button
            className="px-8 py-3 mt-10 bg-[#023E8A] text-white font-medium rounded-lg cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            Show all 80 reviews
          </button>
        </div>
      )}

      {/* Reviews Modal */}
      {openModal && <ReviewsModal onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default Reviews;

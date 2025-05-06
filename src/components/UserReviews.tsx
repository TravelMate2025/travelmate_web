import React, { useState } from "react";
import { ReviewCard } from "../components/UserReviewCard"
import { ReviewModal } from "../components/modals/UserReviewModal";

type Review = {
  id: number;
  name: string;
  image: string;
  dateRange: string;
  price: string;
  comment: string;
  rating: number;
};

type ReviewsProps = {
  reviews: Review[];
};

const StarIcon = () => (
  <svg
    className="w-16 h-16 text-gray-300"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 18l6.928 3.69-1.326-7.76 5.648-5.496-7.825-1.14-3.501-6.478-3.501 6.478-7.825 1.14 5.648 5.496-1.326 7.76z" />
  </svg>
);

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddReviewClick = () => {
    // Open the modal to add a review
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      {reviews.length === 0 ? (
        <div className="flex justify-center items-center mt-20 flex-col space-y-4">
          <div className="bg-gray-200 p-6 rounded-full">
            <StarIcon />
          </div>
          <p className="text-2xl font-semibold text-gray-800">No Stays to reviews yet.</p>
          <p className="text-lg text-gray-500 text-center">After adding a stay, you'll be able to share your experience</p>
          <button
            className="bg-[#023E8A] text-white px-6 py-2 rounded-lg"
            onClick={handleAddReviewClick}
          >
            Add Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Reviews;

import React from "react";
import { useNavigate } from "react-router-dom";

type ReviewCardProps = {
  review: {
    id: number;
    name: string;
    image: string;
    dateRange: string;
    price: string;
    comment: string;
    rating: number;
  };
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the review detail page
    navigate(`/reviews/${review.id}`);
  };

  return (
    <div className="flex bg-white shadow-lg rounded-xl p-4">
      <img src={review.image} alt={review.name} className="w-1/5 h-full object-cover rounded-lg" />
      <div className="w-4/5 pl-4 flex flex-col justify-between">
        <div>
          <h4 className="text-xl font-semibold">{review.name}</h4>
          <p className="text-sm text-gray-500">{review.dateRange}</p>
          <p className="text-lg font-medium text-gray-700">{review.price}</p>
        </div>
        <div className="flex justify-between items-center">
          <button
            className="text-red-500 flex items-center space-x-2"
            onClick={() => alert("Delete review")}
          >
            <span className="material-icons">delete</span>
            <span>Delete</span>
          </button>
          <button
            className="text-blue-500"
            onClick={handleClick}
          >
            View Review
          </button>
        </div>
      </div>
    </div>
  );
};

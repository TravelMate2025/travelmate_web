import React from "react";
import { useNavigate } from 'react-router-dom';


type ReviewDetailProps = {
  review: {
    id: number;
    name: string;
    image: string;
    dateRange: string;
    price: string;
    comment: string;
    rating: number;
    questions: { question: string; rating: number }[];
  };
};

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-6">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleBackClick}
      >
        &lt; Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex">
          <img
            src={review.image}
            alt={review.name}
            className="w-1/4 h-full object-cover rounded-lg"
          />
          <div className="w-3/4 pl-4">
            <h4 className="text-xl font-semibold">{review.name}</h4>
            <p className="text-sm text-gray-500">{review.dateRange}</p>
            <p className="text-lg font-medium text-gray-700">{review.price}</p>
            <p className="text-lg mt-2">{review.comment}</p>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="text-xl font-semibold mb-4">Review Questions</h5>
          {review.questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p className="text-lg">{question.question}</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i <= question.rating ? "text-blue-500" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.561-.954L10 0l2.95 5.956 6.561.954-4.755 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;

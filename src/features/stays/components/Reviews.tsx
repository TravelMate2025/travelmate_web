import { Rating } from "@mui/material";
import { useMediaQuery } from "react-responsive";

interface Review {
  id: number;
  rating: number;
  date: string;
  title: string;
  content: string;
  name: string;
}
interface Props {
  reviews: Review[];
  closeModal: () => void;
  openModal: () => void;
}

const ratings = [
  { category: "Cleanliness", score: 3.2 },
  { category: "Service", score: 3.7 },
  { category: "Comfort", score: 4.1 },
  { category: "Location", score: 2.9 },
  { category: "Facilities", score: 4.6 },
];

const Reviews = ({ reviews, closeModal, openModal }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="my-10">
      {/* Title and Mobile Show All Button */}
      <div className="flex justify-between items-center mt-10">
        <h2 className="text-xl font-bold">Reviews</h2>
        {isMobile && reviews?.length > 0 && (
          <button className="text-[#023E8A] font-medium" onClick={closeModal}>
            Show all &gt;
          </button>
        )}
      </div>

      {/* Overall Rating */}
      {!isMobile && reviews?.length > 0 && (
        <div className="mt-2">
          <Rating
            name="read-only"
            value={4.8}
            precision={0.1}
            readOnly
            sx={{ color: "orange" }}
          />
          <p className="text-xl font-bold">4.8</p>
          <p className="text-gray-600">Based on {reviews?.length} reviews</p>
        </div>
      )}

      {/* Category Ratings */}
      {!isMobile && reviews?.length > 0 && (
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
          isMobile
            ? "overflow-x-auto whitespace-nowrap -mx-2 px-2"
            : "grid grid-cols-3 gap-6"
        }`}
      >
        {reviews?.slice(0, 6).map((review) => (
          <div
            key={review?.id}
            className={`p-4 border border-gray-300 rounded-lg shadow bg-white ${
              isMobile ? "inline-block w-[85%] mr-4 max-w-full" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <Rating
                value={review?.rating}
                readOnly
                sx={{ color: "orange" }}
              />
              <span className="text-gray-500 text-sm">{review?.date}</span>
            </div>
            <h3 className="text-lg font-bold my-2">{review?.title}</h3>
            <p className="text-gray-600 text-wrap line-clamp-2">
              {review?.content}
            </p>
            <p className="text-sm font-medium mt-2">{review?.name}</p>
          </div>
        ))}
      </div>

      {/* Show All Button for Desktop */}
      {!reviews || reviews?.length === 0 ? (
        <div className="text-center ">No reviews available</div>
      ) : (
        <div className="mt-6 hidden lg:flex justify-center">
          <button
            className="px-8 py-3 mt-10 bg-[#023E8A] text-white font-medium rounded-lg cursor-pointer"
            onClick={openModal}
          >
            Show all {reviews?.length} reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;

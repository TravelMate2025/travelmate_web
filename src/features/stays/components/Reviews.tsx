import { Rating } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { CatalogReview } from "../types";

interface Props {
  reviews: CatalogReview[];
  closeModal: () => void;
  openModal: () => void;
}

const formatReviewDate = (submittedAt?: string): string => {
  if (!submittedAt) return "";
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Reviews = ({ reviews, closeModal, openModal }: Props) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviews.length
      : 0;

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
            value={averageRating}
            precision={0.1}
            readOnly
            sx={{ color: "orange" }}
          />
          <p className="text-xl font-bold">{averageRating.toFixed(1)}</p>
          <p className="text-gray-600">Based on {reviews?.length} reviews</p>
        </div>
      )}

      {/* Customer Reviews */}
      <div
        className={`mt-10 ${
          isMobile
            ? "overflow-x-auto whitespace-nowrap -mx-2 px-2"
            : "grid grid-cols-3 gap-6"
        }`}
      >
        {reviews?.slice(0, 6).map((review, index) => (
          <div
            key={index}
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
              <span className="text-gray-500 text-sm">
                {formatReviewDate(review?.submittedAt)}
              </span>
            </div>
            <p className="text-gray-600 text-wrap line-clamp-2 mt-2">
              {review?.comment}
            </p>
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

import { useCallback, useEffect, useState } from "react";
import { ReviewCard } from "./UserReviewCard";
import { ReviewModal } from "./modals/UserReviewModal";
import { getUserReviews } from "../api";
import { Skeleton } from "antd";
import { ChevronLeft, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Review = {
  id: number;
  hotel_name: string;
  hotel_code: string;
  hotel_image_url: string;
  date_reviewed: string;
  cost?: number;
  comment: string;
  rating: number;
  title: string;
};

const LoaderCard = () => {
  return (
    <div className="shadow-lg p-4 gap-x-6 border border-black/10 flex rounded-lg">
      <div className="flex-1">
        <Skeleton.Button style={{ height: 150 }} block active />
      </div>
      <div className="flex-2 space-y-4">
        <Skeleton.Button active block />
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
      <div>
        <Skeleton.Button active />
      </div>
    </div>
  );
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

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="flex mb-4 sticky top-0 items-center lg:hidden">
      <button onClick={() => navigate(-1)}>
        <ChevronLeft />
      </button>
      <div className="flex-1 text-center">
        <p className="text-xl font-semibold text-[#181818]">Reviews</p>
      </div>
    </header>
  );
};

const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null | undefined>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reviewRes = await getUserReviews();
      setReviews(reviewRes);
    } catch (err) {
      const errMessage =
        (err as Error)?.message ?? "An error occurred could not get reviews";
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  // const handleAddReviewClick = () => {
  //   // Open the modal to add a review
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Header/>
        <LoaderCard />
        <LoaderCard />
        <LoaderCard />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header/>
        <div className="flex min-h-[400px] justify-center max-w-[450px] p-4 mx-auto items-center mt-20 flex-col">
          <div className="">
            <CircleAlert size={80} className="text-red-400" />
          </div>
          <p className="text-xl lg:text-2xl font-semibold text-black">
            An Error Occurred
          </p>
          <p className="text-base lg:text-lg text-[#67696D] text-center">
            {error ?? "Please check your network connection and try again"}
          </p>
          <button
            className="bg-red-400 mt-4 text-white px-6 py-2 rounded-lg"
            onClick={getReviews}
          >
            Refresh
          </button>
        </div>
      </>
    );
  }

  if (reviews.length == 0) {
    return (
      <>
        <Header/>
        <div className="min-h-[400px] flex justify-center max-w-[450px] p-4 mx-auto items-center flex-col">
          <div className="bg-[#F5F5F5] border border-[#DEDFE1] p-4 lg:p-6 rounded-full">
            <StarIcon />
          </div>
          <p className="text-xl hidden lg:block lg:text-2xl font-semibold text-black">
            No Stays to reviews yet.
          </p>
          <p className="text-xl lg:hidden font-semibold text-black">
            No Review Yet
          </p>
          <p className="text-base hidden lg:block lg:text-lg text-[#67696D] text-center">
            After adding a stay, you'll be able to share your experience
          </p>
          <p className="text-base lg:hidden lg:text-lg text-[#67696D] text-center">
            You haven't reviewed any stays yet. Once you review a stay, you'll
            see it here.
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="container mx-auto min-h-screen px-4">
      <Header/>
      <div className="space-y-4 my-8">
        {reviews.map((review) => (
          <ReviewCard onFinish={getReviews} key={review.id} review={review} />
        ))}
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default Reviews;

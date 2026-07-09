import { ReactNode, useCallback, useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Navbar from "../../../pages/homePage/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUserReview, getUserReview } from "../../stays/api";
import { ChevronLeft, CircleAlert, LoaderCircle, X } from "lucide-react";
import { DateTime } from "luxon";
import Footer from "../../../components/2Footer";
import TravelmateApp from "../../../pages/homePage/TravelmateApp";
import Skeleton from "@mui/material/Skeleton";
import { toast } from "react-hot-toast";

interface Review {
  id: number;
  hotel_name: string;
  hotel_code: string;
  hotel_image_url: string;
  date_reviewed: string;
  cost?: number;
  comment: string;
  rating: number;
  title: string;
}

const StarFillIcon = () => {
  return (
    <svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9531 1.61719L15.6473 9.90898H24.3658L17.3124 15.0336L20.0065 23.3254L12.9531 18.2008L5.8997 23.3254L8.59387 15.0336L1.54045 9.90898H10.259L12.9531 1.61719Z"
        fill="#023E8A"
        stroke="#023E8A"
      />
    </svg>
  );
};
const StarOutlineIcon = () => {
  return (
    <svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9531 1.61719L15.6473 9.90898H24.3658L17.3124 15.0336L20.0065 23.3254L12.9531 18.2008L5.8997 23.3254L8.59387 15.0336L1.54045 9.90898H10.259L12.9531 1.61719Z"
        stroke="#023E8A"
      />
    </svg>
  );
};

const ReviewLayout = ({ children }: { children: ReactNode }) => {
  const breadcrumbs = [
    { name: "Home", link: "/" },
    { name: "Account", link: "/account" },
    { name: "Reviews" },
  ];

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <section className="mt-[100px] max-w-[1250px] mx-auto px-4">
        <div className="hidden lg:block">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <header className="flex mb-4 sticky top-0 items-center lg:hidden">
          <button onClick={() => navigate(-1)}>
            {" "}
            <ChevronLeft />
          </button>
          <div className="flex-1 text-center">
            <p className="text-xl font-semibold text-[#181818]">Reviews</p>
          </div>
        </header>
        <div className="py-10">{children}</div>
      </section>
      <TravelmateApp />
      <Footer />
    </>
  );
};

const CheckIcon = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.313 52.9151L15.413 39.0151L10.6797 43.7151L29.313 62.3484L69.313 22.3484L64.613 17.6484L29.313 52.9151Z"
        fill="white"
      />
    </svg>
  );
};

const Loader = () => {
  return (
    <div className="shadow-lg p-4 gap-x-6 border border-black/10 flex rounded-lg">
      <div className="flex-1">
        <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
      </div>
      <div className="flex-2 space-y-4">
        <Skeleton variant="text" width="85%" height={28} animation="wave" />
        <Skeleton variant="text" width="100%" height={20} animation="wave" />
        <Skeleton variant="text" width="92%" height={20} animation="wave" />
      </div>
      <div>
        <Skeleton variant="rounded" width={96} height={40} animation="wave" />
      </div>
    </div>
  );
};

export function ReviewDetails() {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);
  const [deleteError, setDeleteError] = useState<string | null | undefined>(
    null,
  );
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { hotel_id } = useParams<{ hotel_id: string }>();

  const getReviewDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!hotel_id) {
        throw new Error("Please provide hotel id");
      }
      const res = await getUserReview(hotel_id);
      if (res) {
        setReview(res);
      }
    } catch (err) {
      const errMessage =
        (err as Error)?.message ??
        "An error occurred could not get review details";
      setError(errMessage);
    } finally {
      setLoading(false);
    }
  }, [hotel_id]);

  const deleteReview = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      if (!hotel_id) {
        throw new Error("Please provide hotel id");
      }
      await deleteUserReview(hotel_id);
      toast.success("Review deleted successfully.");
      setDeleteSuccess(true);
      setTimeout(() => {
        window.location.assign("/profile-info?tab=Reviews");
      }, 3000);
    } catch (err) {
      const errMessage =
        (err as Error)?.message ??
        "An error occurred could not get review details";
      setDeleteError(errMessage);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getReviewDetails();
  }, [getReviewDetails]);

  if (loading) {
    return (
      <ReviewLayout>
        <Loader />
      </ReviewLayout>
    );
  }

  if (!review || error) {
    return (
      <ReviewLayout>
        <div className="flex justify-center max-w-[450px] mx-auto items-center mt-20 flex-col">
          <div className="">
            <CircleAlert size={80} className="text-red-400" />
          </div>
          <p className="text-2xl font-semibold text-black">An Error Occurred</p>
          <p className="text-lg text-[#67696D] text-center">
            {error ?? "Please check your network connection and try again"}
          </p>
          <button
            className="bg-red-400 text-white px-6 py-2 rounded-lg"
            onClick={getReviewDetails}
          >
            Refresh
          </button>
        </div>
      </ReviewLayout>
    );
  }

  const dateReviewed = DateTime.fromJSDate(
    new Date(review.date_reviewed),
  ).toFormat("LLL dd, yyyy");

  return (
    <ReviewLayout>
      <div>
        <div className="border border-[#CDCED1] rounded-xl p-6">
          <header className="flex">
            <div className="flex-2 lg:flex-1 rounded-lg h-[65px] lg:h-[88px] bg-black/10">
              <img
                src={review.hotel_image_url}
                alt={review.hotel_name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-4/5 pl-4 flex flex-4 flex-col justify-between">
              <div>
                <h4 className="text-sm lg:text-lg text-[#181818] font-medium">
                  {review.hotel_name}
                </h4>
                <p className="text-[#67696D] text-xs lg:text-base">
                  {dateReviewed}
                </p>
                <p className="text-[#67696D] text-xs lg:text-base">
                  ₦{review.cost?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </header>
          <div className="my-6 py-6 border-y  border-[#CDCED1] space-y-5 lg:space-y-6">
            <div>
              <p className="text-[#181818] text-xs lg:text-lg">
                How do you enjoy your stay?
              </p>
              <div className="flex items-center">
                {new Array(review.rating).fill("").map(() => (
                  <StarFillIcon />
                ))}
                {new Array(5 - review.rating).fill("").map(() => (
                  <StarOutlineIcon />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#181818] text-xs lg:text-lg">
                Was everything clean and tidy?
              </p>
              <div className="flex items-center">
                {new Array(review.rating).fill("").map(() => (
                  <StarFillIcon />
                ))}
                {new Array(5 - review.rating).fill("").map(() => (
                  <StarOutlineIcon />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#181818] text-xs lg:text-lg">
                Did you get good value for your money?
              </p>
              <div className="flex items-center">
                {new Array(review.rating).fill("").map(() => (
                  <StarFillIcon />
                ))}
                {new Array(5 - review.rating).fill("").map(() => (
                  <StarOutlineIcon />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[#181818] text-xs lg:text-lg">
                How was the location?
              </p>
              <div className="flex items-center">
                {new Array(review.rating).fill("").map(() => (
                  <StarFillIcon />
                ))}
                {new Array(5 - review.rating).fill("").map(() => (
                  <StarOutlineIcon />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[#181818] font-medium text-xs lg:text-lg">
              Other Details
            </p>
            <p className="text-xs lg:text-base">{review.comment}</p>
          </div>
        </div>
        <div className="mt-12 mx-auto max-w-[345px]">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="bg-[#D72638] text-white text-sm lg:text-xl font-medium w-full rounded-lg h-[56px] flex items-center justify-center"
          >
            Delete Review
          </button>
        </div>
      </div>
      {deleteModalOpen && (
        <div className="fixed top-0 left-0 w-full p-4 h-full bg-black/30 z-[100000] flex items-center justify-center">
          <div className="flex-1 space-y-6 bg-white p-6 pb-9 rounded-xl max-w-[468px]">
            <header className="hidden lg:flex justify-end">
              <button onClick={() => setDeleteModalOpen(false)}>
                <X />
              </button>
            </header>
            {deleteError && (
              <header className="bg-red-100 border border-red-200 text-red-400 rounded-lg p-4">
                {deleteError}
              </header>
            )}
            <p className="text-center text-[#181818] text-lg lg:text-2xl font-medium">
              Delete Review
            </p>
            <p className="text-[#67696D] text-sm lg:text-base text-center">
              Once Deleted, your review will be permanently removed from your
              stay reviews.
            </p>
            <div className="mt-[56] flex gap-x-6">
              <button
                disabled={deleting}
                onClick={() => setDeleteModalOpen(false)}
                className="border disabled:opacity-65 border-[#023E8A] rounded-lg h-[52px] lg:h-[56px] text-[#023E8A] flex-1 font-medium text-sm lg:text-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteReview}
                disabled={deleting}
                className="rounded-lg disabled:opacity-65 flex justify-center gap-x-1 items-center bg-[#D72638] text-white flex-1 h-[52px] lg:h-[56px] font-medium text-sm lg:text-lg"
              >
                {deleting && <LoaderCircle className="animate-spin" />}
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteSuccess && (
        <div className="fixed top-0 left-0 w-full h-full p-4 bg-black/30 z-[100000] flex items-center justify-center">
          <div className="flex-1 space-y-6 bg-white p-6 py-10 pb-9 rounded-xl max-w-[364px]">
            <header className="flex mx-auto bg-[#023E8A] rounded-full h-[120px] w-[120px] justify-center items-center">
              <CheckIcon />
            </header>
            <p className="text-center text-[#181818] text-xl lg:text-2xl font-medium">
              Review Deleted Successfully
            </p>
          </div>
        </div>
      )}
    </ReviewLayout>
  );
}

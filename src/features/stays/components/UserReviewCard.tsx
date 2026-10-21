import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { LoaderCircle, MoreVertical, X } from "lucide-react";
import { deleteUserReview } from "../api";
import { toast } from "react-hot-toast";

type ReviewCardProps = {
  review: {
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
  onFinish?: () => void;
};

const DeleteIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3307 7.5V15.8333H6.66406V7.5H13.3307ZM12.0807 2.5H7.91406L7.08073 3.33333H4.16406V5H15.8307V3.33333H12.9141L12.0807 2.5ZM14.9974 5.83333H4.9974V15.8333C4.9974 16.75 5.7474 17.5 6.66406 17.5H13.3307C14.2474 17.5 14.9974 16.75 14.9974 15.8333V5.83333Z"
        fill="#D72638"
      />
    </svg>
  );
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onFinish }) => {
  const [deleteError, setDeleteError] = useState<string | null | undefined>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [moreShown,setMoreShown] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMoreShown(false);
    }
  };

  if (moreShown) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [moreShown]);

  const deleteReview = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUserReview(review.hotel_code);
      toast.success("Review deleted successfully.");
      onFinish?.();
    } catch (err) {
      const errMessage =
        (err as Error)?.message ??
        "An error occurred could not get review details";
      setDeleteError(errMessage);
    } finally {
      setDeleting(false);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the review detail page
    navigate(`/reviews/${review.hotel_code}`);
  };

  const dateReviewed = DateTime.fromJSDate(
    new Date(review.date_reviewed),
  ).toFormat("LLL dd, yyyy");

  return (
    <>
      <div className="flex border border-[#CDCED1] rounded-xl p-3 lg:p-4">
        <div className="flex-2 lg:flex-1 rounded-lg h-[65px] lg:h-[88px] bg-black/10">
          <img
            src={review.hotel_image_url}
            alt={review.hotel_name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div
          onClick={handleClick}
          className="w-4/5 pl-4 cursor-pointer flex flex-4 flex-col justify-between"
        >
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
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="hidden lg:flex items-center"
          >
            <DeleteIcon />
            <span className="text-[#D72638]">Delete</span>
          </button>
          <button onClick={()=>setMoreShown(prev=>!prev)} className="lg:hidden items-center">
            <MoreVertical size={20} />
          </button>
          {
            moreShown && (
              <div className="absolute lg:hidden top-4 right-0 w-30 bg-white rounded-lg shadow-lg border border-gray-100 px-2 py-1">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-50 transition-colors group"
            >
              <span className="text-red-500 group-hover:text-red-600">
                <DeleteIcon />
              </span>
              <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                Delete
              </span>
            </button>
          </div>
            )
          }
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
    </>
  );
};

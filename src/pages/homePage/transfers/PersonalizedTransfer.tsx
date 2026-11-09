import { useEffect, useState } from "react";
import { FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getRecentlyViewed, RecentlyViewedItem } from "../../../features/shared/recentlyViewed";
import { bookingFlowRoutes } from "../../../features/shared/bookingFlowRoutes";
import { CarTransferOption } from "../../../features/car_rentals/types/booking";
import { CarInfo, setSelectedTransfer } from "../../../features/car_rentals/carPaymentSlice";
import routeSkyline from "../../../assets/images/transfers/route-skyline.jpg";

// Real personalization, not mock data: reuses the same Recently Viewed
// tracking already recorded by TransferDetail.tsx (see recentlyViewed.ts).
// Renders nothing if the visitor hasn't actually viewed a transfer yet --
// no fabricated "recommended for you" content standing in for real history.
const PersonalizedTransfer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [item, setItem] = useState<RecentlyViewedItem | null>(null);

  useEffect(() => {
    const recent = getRecentlyViewed().find((entry) => entry.kind === "transfer");
    setItem(recent ?? null);
  }, []);

  if (!item) return null;

  const handleContinue = () => {
    const { car, departureInfo } = item.payload as { car: CarTransferOption; departureInfo: CarInfo };
    dispatch(setSelectedTransfer(car));
    navigate(`${bookingFlowRoutes.transferDetail}/${item.id}`, { state: { car, departureInfo } });
  };

  return (
    <div className="w-[90%] m-auto mt-[60px]">
      <p className="text-[24px] font-semibold font-inter text-[#181818] mb-1">Personalized for you</p>
      <p className="font-normal text-[#4E4F52] font-inter mb-8">Based on your recent activity</p>
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] rounded-[20px] overflow-hidden shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] bg-white">
        <div className="relative min-h-[220px] md:min-h-[280px]">
          <img
            src={item.imageUrl ?? routeSkyline}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/50 md:bg-gradient-to-r md:from-black/5 md:to-black/55" />
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <p className="text-[11.5px] font-bold font-inter tracking-wide uppercase text-[#FF6F1E] mb-2.5">
            Because you viewed this transfer before
          </p>
          <p className="text-[22px] font-bold font-inter text-[#181818] mb-2">Pick up where you left off</p>
          <p className="text-[14px] font-inter text-[#4E4F52] leading-relaxed mb-5">
            You looked at &ldquo;{item.title}&rdquo;{item.subtitle ? ` (${item.subtitle})` : ""}. It's still available to book.
          </p>
          <div className="flex items-center gap-3 bg-[#F9F9F8] rounded-[14px] px-4 py-3 mb-5">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-[#EAF0FA] flex items-center justify-center flex-shrink-0">
              <FaCar className="text-[#023E8A]" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold font-inter text-[#181818] truncate">{item.title}</p>
              {item.priceLabel && (
                <p className="text-[12px] font-inter text-[#8A9096]">{item.priceLabel}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="self-start bg-[#023E8A] text-white font-inter font-bold text-[13.5px] rounded-[12px] px-6 py-3 cursor-pointer hover:bg-blue-800 transition-colors"
          >
            Continue booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedTransfer;

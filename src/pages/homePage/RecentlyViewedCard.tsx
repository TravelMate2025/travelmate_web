import { FaHotel, FaPlane, FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RecentlyViewedItem } from "../../features/shared/recentlyViewed";
import { bookingFlowRoutes } from "../../features/shared/bookingFlowRoutes";
import { CarTransferOption } from "../../features/car_rentals/types/booking";
import { CarInfo, setSelectedTransfer } from "../../features/car_rentals/carPaymentSlice";

interface RecentlyViewedCardProps {
  item: RecentlyViewedItem;
}

const kindIcon = (kind: RecentlyViewedItem["kind"]) => {
  if (kind === "flight") return <FaPlane size={12} className="text-white" />;
  if (kind === "transfer") return <FaCar size={12} className="text-white" />;
  return <FaHotel size={12} className="text-white" />;
};

// Deliberately smaller and desaturated -- this is a "continue where you
// left off" strip, not a sales pitch, so it's the lowest-weight section on
// Stays home (see plan.md Phase 5). A small kind icon badge (top-left) is
// the only thing distinguishing stay/flight/transfer, since a single card
// type has to render all three.
const RecentlyViewedCard: React.FC<RecentlyViewedCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    switch (item.kind) {
      case "stay":
        navigate(`/stay-details/${item.id}`);
        break;
      case "transfer": {
        const { car, departureInfo } = item.payload as {
          car: CarTransferOption;
          departureInfo: CarInfo;
        };
        dispatch(setSelectedTransfer(car));
        navigate(`${bookingFlowRoutes.transferDetail}/${item.id}`, {
          state: { car, departureInfo },
        });
        break;
      }
      case "flight":
        // No routed flight detail page exists and offers expire -- land on
        // the search entry instead of resuming this exact (possibly stale)
        // offer. Same scope decision as the mobile app for this vertical.
        navigate("/flights");
        break;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-[164px] flex-shrink-0 text-left cursor-pointer group"
    >
      <div className="relative w-full h-[110px] overflow-hidden rounded-[16px] bg-gray-100 saturate-[0.55] group-hover:saturate-100 transition-[filter] duration-300">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {kindIcon(item.kind)}
          </div>
        )}
        <span className="absolute left-1.5 top-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-black/45">
          {kindIcon(item.kind)}
        </span>
      </div>
      <div className="mt-[6px] min-w-0">
        <p className="text-[11.5px] font-medium font-inter text-[#6B7280] line-clamp-1 min-w-0">
          {item.title}
        </p>
      </div>
    </button>
  );
};

export default RecentlyViewedCard;

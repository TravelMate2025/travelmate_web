import { FaHotel, FaPlane, FaCar, FaMapMarkerAlt } from "react-icons/fa";
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

// Matches TopRatedStayCard's 290x194 (3:2) sizing/shadow/radius so a mixed
// stay/flight/transfer row reads as one visual family -- a small kind icon
// badge (top-left) is the only thing distinguishing the three, since a
// single card type has to render all of them.
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
      className="w-[290px] flex-shrink-0 text-left cursor-pointer group"
    >
      <div className="relative w-full h-[194px] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {kindIcon(item.kind)}
          </div>
        )}
        <span className="absolute left-2 top-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/45">
          {kindIcon(item.kind)}
        </span>
        {item.priceLabel && (
          <span className="absolute left-2 bottom-2 bg-[#023E8A] text-white text-[12px] font-bold font-inter px-2 py-[3px] rounded-[8px] shadow-sm">
            {item.priceLabel}
          </span>
        )}
      </div>
      <div className="mt-[10px] min-w-0">
        <p className="text-[15px] font-semibold font-inter text-[#181818] line-clamp-1 min-w-0">
          {item.title}
        </p>
      </div>
      {item.subtitle && (
        <div className="flex items-center gap-1 text-[#4E4F52] text-xs font-inter mt-[2px]">
          <FaMapMarkerAlt size={11} />
          <span className="line-clamp-1">{item.subtitle}</span>
        </div>
      )}
    </button>
  );
};

export default RecentlyViewedCard;

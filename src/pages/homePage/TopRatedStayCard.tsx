import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Hotel } from "../../features/stays/types";

interface TopRatedStayCardProps {
  hotel: Hotel;
}

// Deliberately not StayCard.tsx -- that component is built for full search
// results (favorites button, cancellation policy, price breakdown) and its
// own rating display has the same bug this section exists to avoid: it
// regex-matches digits out of `category` (a property type string like
// "guesthouse", never actually a number) instead of using a real rating,
// so it shows "N/A" in practice. This card is a small, homepage-carousel-
// weight card using the real avgRating this endpoint provides -- also
// reused (name notwithstanding) for the Recommended section, where
// avgRating is usually absent; the rating row just doesn't render then.
const TopRatedStayCard: React.FC<TopRatedStayCardProps> = ({ hotel }) => {
  const navigate = useNavigate();
  const hotelId = hotel.id ?? hotel.code ?? "";
  const coverImg = hotel.images?.find((img) => img.type === "GEN") ?? hotel.images?.[0];
  const mainImage = coverImg?.secureUrl ?? coverImg?.url;
  const address = hotel.address || hotel.destination?.name || "";

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/stay-details/${hotelId}?stay=${encodeURIComponent(hotel.name)}`,
        )
      }
      className="w-[290px] flex-shrink-0 text-left cursor-pointer group"
    >
      {/* 3:2 -- deliberately wider than the destination cards below, since
          stay photography needs to show room/exterior context; kept
          consistent with StaysWidget's ratio on mobile. */}
      <div className="relative w-full h-[194px] overflow-hidden rounded-[20px] bg-gray-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
        {hotel.avgRating != null && (
          <span className="absolute left-2 bottom-2 flex items-center gap-1 bg-[#023E8A] text-white text-[12px] font-bold font-inter px-2 py-[3px] rounded-[8px] shadow-sm">
            <FaStar size={11} className="text-white" />
            {hotel.avgRating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="mt-[10px] flex items-baseline gap-1.5 min-w-0">
        <p className="text-[15px] font-semibold font-inter text-[#181818] line-clamp-1 min-w-0">
          {hotel.name}
        </p>
        {hotel.reviewsCount ? (
          <span className="text-[#8A9096] text-[12px] font-inter flex-shrink-0">
            ({hotel.reviewsCount})
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-1 text-[#4E4F52] text-xs font-inter mt-[2px]">
        <FaMapMarkerAlt size={11} />
        <span className="line-clamp-1">{address}</span>
      </div>
    </button>
  );
};

export default TopRatedStayCard;

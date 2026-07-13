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
// weight card using the real avgRating this endpoint provides.
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
      className="w-[250px] flex-shrink-0 text-left cursor-pointer group"
    >
      <div className="w-full h-[160px] overflow-hidden rounded-lg bg-gray-100">
        {mainImage ? (
          <img
            src={mainImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : null}
      </div>
      <div className="mt-2 flex items-start justify-between gap-2">
        <p className="text-[14px] font-semibold font-inter text-[#181818] line-clamp-1">
          {hotel.name}
        </p>
        <span className="flex items-center gap-1 text-orange-500 text-xs font-medium flex-shrink-0">
          <FaStar />
          <span className="text-black">{hotel.avgRating?.toFixed(1)}</span>
        </span>
      </div>
      <div className="flex items-center gap-1 text-[#4E4F52] text-xs font-inter">
        <FaMapMarkerAlt />
        <span className="line-clamp-1">{address}</span>
        {hotel.reviewsCount ? <span>&middot; {hotel.reviewsCount} review{hotel.reviewsCount === 1 ? "" : "s"}</span> : null}
      </div>
    </button>
  );
};

export default TopRatedStayCard;

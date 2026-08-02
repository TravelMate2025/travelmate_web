import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Hotel } from "../../features/stays/types";

const SIZE = {
  default: { w: "w-[290px]", h: "h-[194px]" },
  large: { w: "w-[320px]", h: "h-[220px]" },
  compact: { w: "w-[188px]", h: "h-[126px]" },
} as const;

const BADGE_TONE = {
  navy: "bg-[#023E8A]/90 text-white",
  orange: "bg-[#FF6F1E] text-white",
  green: "bg-[#227A53] text-white",
} as const;

interface TopRatedStayCardProps {
  hotel: Hotel;
  // Set by carousels that filter/sort into a meaningful category (e.g.
  // "Best Value" on the Budget-Friendly row, "For You" on Recommended) --
  // not stored on the hotel itself, since the same stay can carry a
  // different badge depending on which row it's rendered in.
  badge?: string;
  badgeTone?: keyof typeof BADGE_TONE;
  // "large" (Top Rated) and "compact" (Budget-Friendly) give those two rows
  // their own visual weight instead of every carousel on the page rendering
  // an identical card -- see plan.md Phase 5.
  size?: keyof typeof SIZE;
  // Nearby-only: a location-pin badge and a mock distance line. There is no
  // real lat/lng radius search yet (search is city-string based), so this
  // is illustrative content shipped intentionally as a placeholder -- see
  // the "Near You" decision in plan.md Phase 5, not a bug to "fix" later
  // without a product/backend decision first.
  pin?: boolean;
  distanceLabel?: string;
}

// Deliberately not StayCard.tsx -- that component is built for full search
// results (favorites button, cancellation policy, price breakdown) and its
// own rating display has the same bug this section exists to avoid: it
// regex-matches digits out of `category` (a property type string like
// "guesthouse", never actually a number) instead of using a real rating,
// so it shows "N/A" in practice. This card is a small, homepage-carousel-
// weight card using the real avgRating this endpoint provides -- also
// reused (name notwithstanding) across every Stays home carousel, each one
// passing different `size`/`badge`/`pin` props so the six sections don't
// all read as one repeated block.
const TopRatedStayCard: React.FC<TopRatedStayCardProps> = ({
  hotel,
  badge,
  badgeTone = "navy",
  size = "default",
  pin = false,
  distanceLabel,
}) => {
  const navigate = useNavigate();
  const hotelId = hotel.id ?? hotel.code ?? "";
  const coverImg = hotel.images?.find((img) => img.type === "GEN") ?? hotel.images?.[0];
  const mainImage = coverImg?.secureUrl ?? coverImg?.url;
  const address = hotel.address || hotel.destination?.name || "";
  const currencyCode = hotel.currency ?? "NGN";
  const isCompact = size === "compact";
  const isLarge = size === "large";
  const { w, h } = SIZE[size];

  return (
    <button
      type="button"
      onClick={() =>
        navigate(
          `/stay-details/${hotelId}?stay=${encodeURIComponent(hotel.name)}`,
        )
      }
      className={`${w} flex-shrink-0 text-left cursor-pointer group`}
    >
      {/* 3:2 -- deliberately wider than the destination cards below, since
          stay photography needs to show room/exterior context; kept
          consistent with StaysWidget's ratio on mobile. "large"/"compact"
          scale the same ratio up/down for Top Rated vs Budget-Friendly. */}
      <div
        className={`relative w-full ${h} overflow-hidden rounded-[20px] bg-gray-100 shadow-[0_10px_24px_-12px_rgba(15,23,42,0.35)] ${
          isLarge ? "ring-1 ring-[#E7C27C]/60" : ""
        }`}
      >
        {mainImage ? (
          <img
            src={mainImage}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
        {hotel.avgRating != null && (
          <span
            className={`absolute left-2 bottom-2 flex items-center gap-1 text-[12px] font-bold font-inter px-2 py-[3px] rounded-[8px] shadow-sm ${
              isLarge ? "bg-[#1B140A] text-[#E0AC52]" : "bg-[#023E8A] text-white"
            }`}
          >
            <FaStar size={11} className={isLarge ? "text-[#E0AC52]" : "text-white"} />
            {hotel.avgRating.toFixed(1)}
          </span>
        )}
        {badge && (
          <span
            className={`absolute top-2 left-2 text-[11px] font-bold font-inter px-2.5 py-1 rounded-full ${BADGE_TONE[badgeTone]}`}
          >
            {badge}
          </span>
        )}
        {pin && (
          <span className="absolute top-2 right-2 flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <FaMapMarkerAlt size={12} className="text-[#1B6E83]" />
          </span>
        )}
      </div>
      <div className={`mt-[10px] flex items-baseline gap-1.5 min-w-0 ${isCompact ? "items-start gap-0" : ""}`}>
        <p
          className={`font-semibold font-inter text-[#181818] line-clamp-1 min-w-0 ${
            isCompact ? "text-[12px] text-[#4E4F52] font-medium" : isLarge ? "text-[16px]" : "text-[15px]"
          }`}
        >
          {hotel.name}
        </p>
        {!isCompact && hotel.reviewsCount ? (
          <span className="text-[#8A9096] text-[12px] font-inter flex-shrink-0">
            ({hotel.reviewsCount})
          </span>
        ) : null}
      </div>
      {!isCompact && (
        <div className="flex items-center gap-1 text-[#4E4F52] text-xs font-inter mt-[2px]">
          <FaMapMarkerAlt size={11} />
          <span className="line-clamp-1">{address}</span>
        </div>
      )}
      {distanceLabel && (
        <p className="mt-[2px] text-[11.5px] font-semibold font-inter text-[#1B6E83]">{distanceLabel}</p>
      )}
      {hotel.priceFrom != null && (
        <p
          className={`font-bold font-inter text-[#181818] ${
            isCompact ? "text-[15px] mb-[2px]" : "mt-[6px] text-[15px]"
          }`}
        >
          {currencyCode} {hotel.priceFrom.toLocaleString("en-NG")}
          <span className="text-[11.5px] font-normal text-[#8A9096]"> /night</span>
        </p>
      )}
    </button>
  );
};

export default TopRatedStayCard;

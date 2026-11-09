import { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Hotel } from "../../../features/stays/types";
import TopRatedStayCard from "../TopRatedStayCard";
import categoryHotel from "../../../assets/images/stays/category-hotel.jpg";
import categoryApartment from "../../../assets/images/stays/category-apartment.jpg";
import categoryVilla from "../../../assets/images/stays/category-villa.jpg";
import categoryGuesthouse from "../../../assets/images/stays/category-guesthouse.jpg";
import categoryResort from "../../../assets/images/stays/category-resort.jpg";
import categoryBungalow from "../../../assets/images/stays/category-bungalow.jpg";

interface StaysCategoryBrowseProps {
  stays: Hotel[];
}

// propertyType is real data (already surfaced on the stay detail page via
// propertyTypeDisplayLabel) but nothing on the home screen let a visitor
// browse by it -- this was the "quick booking categories" module the
// content checklist in plan.md calls for and Stays was missing. The
// backend has no propertyType filter param on search yet, so this filters
// the same client-side dataset the segmented carousels already fetch,
// same pattern as Top Rated/Budget-Friendly/Trending. Each chip's photo is
// generic stock representing the category, not any specific listing --
// only decorative, not standing in for real per-listing data.
const CATEGORY_DEFS: { key: string; label: string; image: string }[] = [
  { key: "hotel", label: "Hotels", image: categoryHotel },
  { key: "apartment", label: "Apartments", image: categoryApartment },
  { key: "villa", label: "Villas", image: categoryVilla },
  { key: "guesthouse", label: "Guesthouses", image: categoryGuesthouse },
  { key: "resort", label: "Resorts", image: categoryResort },
  { key: "bungalow", label: "Bungalows", image: categoryBungalow },
];

const StaysCategoryBrowse = ({ stays }: StaysCategoryBrowseProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const categoriesPresent = useMemo(() => {
    const present = new Set(
      stays
        .map((hotel) => hotel.propertyType?.toLowerCase().trim())
        .filter((type): type is string => Boolean(type)),
    );
    return CATEGORY_DEFS.filter((def) => present.has(def.key));
  }, [stays]);

  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected
    ? stays.filter((hotel) => hotel.propertyType?.toLowerCase().trim() === selected)
    : [];

  // Real backend data doesn't reliably populate propertyType yet on every
  // listing -- hide the module entirely rather than show an empty or
  // misleading chip row when there's nothing to browse by.
  if (categoriesPresent.length === 0) return null;

  return (
    <div className="w-[90%] m-auto">
      <div className={isMobile ? "mt-[6px]" : "mt-[60px]"}>
        <p className={isMobile ? "text-[16px] font-semibold font-inter text-[#181818]" : "text-[24px] font-semibold font-inter text-[#181818]"}>
          Browse by stay type
        </p>
        <p className={isMobile ? "font-normal text-[#4E4F52] font-inter text-[14px]" : "font-normal text-[#4E4F52] font-inter"}>
          Pick a category to filter what's available
        </p>
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="mt-[22px] flex gap-5 overflow-x-auto scroll-smooth flex-nowrap"
        >
          {categoriesPresent.map((def) => {
            const isActive = selected === def.key;
            return (
              <button
                key={def.key}
                type="button"
                onClick={() => setSelected(isActive ? null : def.key)}
                className="flex flex-col items-center gap-[9px] flex-shrink-0 w-[92px] cursor-pointer"
              >
                <div
                  className="w-[76px] h-[76px] rounded-full overflow-hidden shadow-[0_6px_16px_-8px_rgba(15,23,42,0.35)]"
                  style={{ border: isActive ? "2.5px solid #FF6F1E" : "2.5px solid transparent" }}
                >
                  <img src={def.image} alt={def.label} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[13px] font-inter ${isActive ? "font-bold text-[#181818]" : "font-semibold text-[#4E4F52]"}`}>
                  {def.label}
                </span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="mt-[26px] flex gap-6 overflow-x-auto scroll-smooth flex-nowrap"
          >
            {filtered.length > 0 ? (
              filtered.map((hotel) => (
                <TopRatedStayCard key={hotel.id ?? hotel.code} hotel={hotel} />
              ))
            ) : (
              <p className="text-[14px] font-inter text-[#8A9096] py-4">
                No {CATEGORY_DEFS.find((d) => d.key === selected)?.label.toLowerCase()} in this list right now.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaysCategoryBrowse;

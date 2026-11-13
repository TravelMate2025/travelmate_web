import { useNavigate } from "react-router-dom";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import { formatMoney } from "../../currency";
import type { CabinClass, ClassFares } from "../../types";
import { CARD_SHADOW, SECTION_CLASS, SECTION_SUB_CLASS, SECTION_TITLE_CLASS } from "./landingStyles";

// Mock: "Browse by class" with "from" fares for one route. Choosing a class
// sets the cabin in the search form.
const CLASSES: { cabin: CabinClass; name: string; short: string; meta: string; photo: string; alt: string }[] = [
  { cabin: "ECONOMY", name: "Economy", short: "Economy", meta: "Standard seat; bags depend on the fare", photo: "cabin-economy", alt: "Passengers seated in an economy cabin" },
  { cabin: "PREMIUM_ECONOMY", name: "Premium Economy", short: "Premium", meta: "More legroom; fewer routes offer it", photo: "cabin-premium-economy", alt: "Leather seat by an aircraft window" },
  { cabin: "BUSINESS", name: "Business", short: "Business", meta: "Larger seat and priority service", photo: "cabin-business", alt: "Business class seat with pillow" },
  { cabin: "FIRST", name: "First", short: "First", meta: "Top cabin, on selected airlines only", photo: "cabin-first", alt: "Aircraft wing at sunrise above the clouds" },
];

export const ClassBrowse = ({ classFares }: { classFares: ClassFares | null }) => {
  const navigate = useNavigate();
  const fareFor = (cabin: CabinClass) => classFares?.fares.find((f) => f.cabin === cabin)?.priceFrom ?? null;
  const route = classFares ? `${classFares.origin.city} → ${classFares.destination.city}` : null;

  return (
    <section aria-labelledby="flights-class-h" className={SECTION_CLASS}>
      <div>
        <h2 id="flights-class-h" className={SECTION_TITLE_CLASS}>
          Browse by class
        </h2>
        <p className={SECTION_SUB_CLASS}>
          Pick a cabin and we'll set it in your search.
          {route && ` ${route} one-way fares from our latest search.`}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CLASSES.map((c) => {
          const fare = fareFor(c.cabin);
          return (
            <button
              key={c.cabin}
              type="button"
              onClick={() => navigate(flightsLandingPath({ cabin: c.cabin }))}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#EBECED] bg-white text-left ${CARD_SHADOW}`}
            >
              <span className="relative block h-36 overflow-hidden">
                <img
                  src={`/images/flights/${c.photo}.jpg`}
                  alt={c.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="flex flex-1 flex-col gap-1.5 p-4">
                <strong className="text-base text-[#181818]">{c.name}</strong>
                <span className="text-sm text-[#4E4F52]">{c.meta}</span>
                <span className="mt-auto flex items-baseline justify-between gap-2 pt-2">
                  <span className="text-lg font-extrabold text-[#181818]">
                    {fare ? (
                      <>
                        from {formatMoney(fare.amount, fare.currency)} <span className="text-xs font-medium text-[#4E4F52]">one-way</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-[#4E4F52]">See fares</span>
                    )}
                  </span>
                  <span className="rounded-lg bg-[#EAF0FA] px-3 py-1.5 text-sm font-bold text-[#023E8A]">Search {c.short}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

import { useNavigate } from "react-router-dom";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import { formatMoney } from "../../currency";
import type { PopularRoute } from "../../types";
import { CARD_SHADOW, CITY_PHOTOS, COUNTRY_CHOICES, COUNTRY_NAMES, SECTION_CLASS, SECTION_SUB_CLASS, SECTION_TITLE_CLASS } from "./landingStyles";

interface PopularRoutesProps {
  routes: PopularRoute[];
  loading: boolean;
  country: string | null;
  onCountryChange: (country: string) => void;
}

// Mock: "Popular routes from Nigeria", lowest one-way fares, "Change country".
// A card fills From and To in the search form and opens the date picker.
export const PopularRoutes = ({ routes, loading, country, onCountryChange }: PopularRoutesProps) => {
  const navigate = useNavigate();
  const countryName = country ? COUNTRY_NAMES[country] : undefined;
  if (!loading && routes.length === 0) return null;

  return (
    <section aria-labelledby="flights-routes-h" className={SECTION_CLASS}>
      <div>
        <h2 id="flights-routes-h" className={SECTION_TITLE_CLASS}>
          {countryName ? `Popular routes from ${countryName}` : "Popular routes"}
        </h2>
        <p className={`${SECTION_SUB_CLASS} flex flex-wrap items-center gap-x-2`}>
          Lowest one-way fares from our latest search, refreshed daily.
          <label className="inline-flex items-center gap-1 font-semibold text-[#023E8A]">
            <span>Change country</span>
            <select
              aria-label="Country for popular routes"
              value={country ?? ""}
              onChange={(event) => onCountryChange(event.target.value)}
              className="cursor-pointer rounded-md bg-transparent font-semibold text-[#023E8A]"
            >
              {!country && <option value="">Choose</option>}
              {COUNTRY_CHOICES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-busy={loading}>
        {loading &&
          [0, 1, 2, 3].map((i) => <div key={i} aria-hidden className="h-52 animate-pulse rounded-3xl bg-gray-200" />)}
        {routes.map((route) => {
          const photo = CITY_PHOTOS[route.destination.cityCode];
          const domestic = route.origin.countryCode === route.destination.countryCode;
          return (
            <button
              key={`${route.origin.code}-${route.destination.code}`}
              type="button"
              onClick={() => navigate(flightsLandingPath({ from: route.origin.code, to: route.destination.code }))}
              className={`group relative h-52 cursor-pointer overflow-hidden rounded-3xl bg-linear-to-br from-[#052a5c] via-[#0e5aa8] to-[#2f86d6] text-left text-white ${CARD_SHADOW}`}
            >
              {photo && (
                <img
                  src={photo}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-white/25 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
                {route.priceFrom ? `From ${formatMoney(route.priceFrom.amount, route.priceFrom.currency)}` : "See fares"}
              </span>
              <span className="absolute bottom-3.5 left-4 right-4">
                <span className="block text-base font-bold">
                  {route.origin.city} → {route.destination.city}
                </span>
                <span className="mt-0.5 block text-sm opacity-90">{domestic ? "Domestic" : "International"} · one-way</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

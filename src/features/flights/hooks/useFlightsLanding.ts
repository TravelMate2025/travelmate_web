import { useEffect, useState } from "react";
import { flightsApi } from "../api";
import type { Campaign, ClassFares, PopularRoute } from "../types";
import { useFlightCountry, useFlightCurrency } from "./useFlightCurrency";

interface LandingContent {
  popularRoutes: PopularRoute[];
  classFares: ClassFares | null;
  campaign: Campaign | null;
}

const EMPTY: LandingContent = { popularRoutes: [], classFares: null, campaign: null };

// Content for the /flights page sections. Page-only, so it isn't kept in Redux.
// Each part fails on its own: a missing section is hidden, the page still works.
export const useFlightsLanding = () => {
  const { country, setCountry } = useFlightCountry();
  const { currency } = useFlightCurrency();
  const [content, setContent] = useState<LandingContent>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.allSettled([
      flightsApi.getPopularRoutes(country, currency),
      flightsApi.getClassFares(country, currency),
      flightsApi.getCampaign(country),
    ]).then(([routes, fares, campaign]) => {
      if (cancelled) return;
      setContent({
        popularRoutes: routes.status === "fulfilled" ? routes.value : [],
        classFares: fares.status === "fulfilled" ? fares.value : null,
        campaign: campaign.status === "fulfilled" ? campaign.value : null,
      });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [country, currency]);

  return { ...content, loading, country, setCountry };
};

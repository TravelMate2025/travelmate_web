import { Link } from "react-router-dom";
import { flightsLandingPath } from "../../../shared/bookingFlowRoutes";
import type { Campaign } from "../../types";

// Mock: promo card. Content is set by staff in the dashboard; nothing shows
// when no campaign is running.
export const CampaignCard = ({ campaign }: { campaign: Campaign | null }) => {
  if (!campaign) return null;
  const to = campaign.route ? flightsLandingPath({ from: campaign.route.origin, to: campaign.route.destination }) : flightsLandingPath();

  return (
    <section aria-label="Promotion" className="relative mt-14 flex min-h-52 items-center overflow-hidden rounded-3xl">
      <img src="/images/flights/city-london.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 bg-linear-to-r from-[#011A3C]/95 via-[#023E8A]/80 to-[#023E8A]/40" />
      <div className="relative max-w-xl px-8 py-10 text-white sm:px-11">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#FFD7BD]">{campaign.label}</p>
        <p className="mb-2 text-2xl font-extrabold sm:text-3xl">{campaign.headline}</p>
        <p className="mb-5 opacity-90">{campaign.body}</p>
        <Link
          to={to}
          className="inline-flex min-h-11.5 items-center rounded-xl bg-white px-5.5 font-extrabold text-[#023E8A] no-underline"
        >
          {campaign.ctaLabel}
        </Link>
      </div>
    </section>
  );
};

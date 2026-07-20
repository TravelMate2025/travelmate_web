import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaBed,
  FaCar,
  FaPlane,
  FaHandshake,
} from "react-icons/fa";
import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { InfoProvider, type Partner } from "../features/account/api/info";
import { usePageMeta } from "../hooks/usePageMeta";

const integrationSteps = [
  {
    title: "Connect your inventory",
    body: "Share your stays, flights, or vehicle inventory through our partner API — no need to integrate with each TravelMate app separately.",
  },
  {
    title: "We normalize & list it",
    body: "TravelMate's backend maps your data into one consistent contract, so it displays correctly across web and mobile automatically.",
  },
  {
    title: "Travelers book & pay",
    body: "Bookings, payment handoff, and confirmations run through TravelMate's existing checkout — travelers never leave the app.",
  },
  {
    title: "You get the booking",
    body: "Confirmed bookings sync back to you with the same lifecycle events (confirmed, cancelled, refunded) our own team relies on.",
  },
];

const verticals = [
  {
    icon: FaBed,
    name: "Stays",
    status: "Live",
    live: true,
    body: "Verified stay partners are live and bookable today, with real-time pricing and availability shown at search.",
  },
  {
    icon: FaCar,
    name: "Airport Transfers",
    status: "Live",
    live: true,
    body: "Vehicle and transfer partners are live and bookable today, with transparent per-trip pricing.",
  },
  {
    icon: FaPlane,
    name: "Flights",
    status: "In Progress",
    live: false,
    body: "Flight search and booking is built and integrated; we're onboarding airline supply and expanding coverage.",
  },
];

const credibilityItems = [
  {
    title: "Normalized API adapter layer",
    body: "Send us your data in your own shape; our backend handles mapping it consistently for every client.",
  },
  {
    title: "Full booking lifecycle support",
    body: "Confirmed, cancelled, and refunded states are handled end-to-end, not just the initial booking.",
  },
  {
    title: "Secure payment handoff",
    body: "Checkout runs through TravelMate's existing Flutterwave integration — no separate payment setup needed.",
  },
  {
    title: "Automatic confirmations",
    body: "Travelers get booking confirmations without you building your own notification flow.",
  },
  {
    title: "Favorites & reviews built in",
    body: "Your listings benefit from TravelMate's existing favoriting and review system — no extra integration required.",
  },
  {
    title: "One team, one point of contact",
    body: "A single partnerships contact for onboarding, support, and ongoing account management.",
  },
];

// Category slugs/labels mirror the backend's real CATEGORY_CHOICES
// (core/applications/policy/models.py PartnerCategory) -- structural, not
// business content, so hardcoding the label here doesn't risk drifting
// from real data the way a fake partner count would.
const partnerCategories: { slug: "stay" | "airline" | "car_rental"; label: string }[] = [
  { slug: "stay", label: "Stay Partners" },
  { slug: "airline", label: "Airline Partners" },
  { slug: "car_rental", label: "Car Rental Partners" },
];

export function PartnersPage() {
  usePageMeta({
    title: "Partners & Suppliers | TravelMate",
    description:
      "Integrate your stays, flights, or car rental inventory with TravelMate — one backend integration, every TravelMate app.",
  });

  // Indexed to match `partnerCategories` -- each entry is that category's
  // partner list. Grouped this way (rather than one flat list filtered by
  // the raw `category` id) because the public endpoint returns `category`
  // as a numeric FK id it doesn't resolve to a slug; the `?category=`
  // query param, which the backend does support, is what actually
  // guarantees each request's results belong to that category.
  const [partnersByCategory, setPartnersByCategory] = useState<Partner[][]>([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          partnerCategories.map((c) => InfoProvider.getPartners(c.slug).catch(() => []))
        );
        if (!cancelled) setPartnersByCategory(results);
      } finally {
        if (!cancelled) setLoadingPartners(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasAnyPartners = partnersByCategory.some((list) => list.length > 0);

  return (
    <>
      <Navbar />
      <div className="mt-[68px] lg:mt-[84px] bg-white text-[#181818]">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#012a5e] via-[#023E8A] to-[#1f6fb2] text-white py-16 md:py-20 px-6 text-center">
          <p className="text-[11px] md:text-[12px] font-bold tracking-[1px] uppercase text-[#BFD6F2] mb-3">
            For Suppliers &amp; Integration Partners
          </p>
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight max-w-[760px] mx-auto mb-4 text-wrap-balance">
            Reach more travelers without building your own booking stack
          </h1>
          <p className="text-[14px] md:text-[16px] text-[#CBD8EE] max-w-[600px] mx-auto mb-8 leading-relaxed">
            TravelMate connects verified stay, airline, and car rental suppliers to
            travelers across our web and mobile apps through one backend-first
            integration.
          </p>
          <a
            href="https://partner.travelmateglo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#FF6F1E] text-white font-bold text-[14px] px-7 py-3.5 rounded-[9px] hover:brightness-95"
          >
            Sign up to partner with us
          </a>
          <p className="text-[12px] text-[#BFD6F2] mt-4">
            Looking for us to integrate with your own API instead?{" "}
            <a href="mailto:support@travelmateglo.com" className="underline hover:text-white">
              Email our partnerships team
            </a>
            .
          </p>
        </div>

        {/* How it works */}
        <section className="max-w-[1180px] mx-auto px-6 py-14 md:py-16">
          <div className="max-w-[640px] mx-auto text-center mb-10">
            <p className="text-[11px] font-bold tracking-[.8px] uppercase text-[#FF6F1E] mb-2">
              How it works
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold mb-2.5">
              One integration, every TravelMate surface
            </h2>
            <p className="text-[13.5px] md:text-[14.5px] text-[#4E4F52] leading-relaxed">
              You integrate once with TravelMate's backend. Every client — web, iOS,
              Android — consumes the same normalized contract, so your inventory
              shows up consistently everywhere without extra work on your end.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {integrationSteps.map((step, i) => (
              <div key={step.title} className="bg-[#EEF0F2] rounded-[16px] p-6">
                <div className="w-8 h-8 rounded-[9px] bg-[#023E8A] text-white flex items-center justify-center font-bold text-[13px] mb-4">
                  {i + 1}
                </div>
                <h3 className="text-[15px] font-bold mb-2">{step.title}</h3>
                <p className="text-[12.5px] text-[#4E4F52] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Verticals status */}
        <section className="max-w-[1180px] mx-auto px-6 py-14 md:py-16">
          <div className="max-w-[640px] mx-auto text-center mb-10">
            <p className="text-[11px] font-bold tracking-[.8px] uppercase text-[#FF6F1E] mb-2">
              Where we are today
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold mb-2.5">Verticals, honestly</h2>
            <p className="text-[13.5px] md:text-[14.5px] text-[#4E4F52] leading-relaxed">
              We'd rather tell you exactly what's live today than overstate it.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {verticals.map(({ icon: Icon, name, status, live, body }) => (
              <div key={name} className="border border-[#D7DBE0] rounded-[16px] p-6">
                <div className="flex items-center justify-between mb-3.5">
                  <Icon className="text-[#023E8A]" size={22} />
                  <span
                    className={`text-[10.5px] font-bold tracking-[.3px] uppercase px-2.5 py-1 rounded-full ${
                      live ? "bg-[#E6F4EA] text-[#1E7A34]" : "bg-[#FFF1E0] text-[#B25E00]"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold mb-2">{name}</h3>
                <p className="text-[12.5px] text-[#4E4F52] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Credibility checklist */}
        <section className="max-w-[1180px] mx-auto px-6 py-14 md:py-16">
          <div className="max-w-[640px] mx-auto text-center mb-10">
            <p className="text-[11px] font-bold tracking-[.8px] uppercase text-[#FF6F1E] mb-2">
              Why integrate with us
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold">What you get out of the box</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {credibilityItems.map(({ title, body }) => (
              <div key={title} className="flex gap-3 items-start">
                <div className="w-[22px] h-[22px] rounded-full bg-[#FFF1E8] text-[#FF6F1E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaCheckCircle size={12} />
                </div>
                <div>
                  <h4 className="text-[13.5px] font-bold mb-0.5">{title}</h4>
                  <p className="text-[12px] text-[#4E4F52] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner directory -- real, backend-driven */}
        <section className="max-w-[1180px] mx-auto px-6 py-14 md:py-16">
          <div className="max-w-[640px] mx-auto text-center mb-10">
            <p className="text-[11px] font-bold tracking-[.8px] uppercase text-[#FF6F1E] mb-2">
              Our partners
            </p>
            <h2 className="text-[24px] md:text-[28px] font-bold">Who we work with</h2>
          </div>

          {loadingPartners ? null : hasAnyPartners ? (
            <div className="space-y-10">
              {partnerCategories.map((cat, i) => {
                const list = partnersByCategory[i] ?? [];
                if (list.length === 0) return null;
                return (
                  <div key={cat.slug}>
                    <h3 className="text-[15px] font-bold mb-4">{cat.label}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                      {list.map((partner) => (
                        <a
                          key={partner.id}
                          href={partner.website ?? undefined}
                          target={partner.website ? "_blank" : undefined}
                          rel={partner.website ? "noreferrer" : undefined}
                          className="border border-[#D7DBE0] rounded-[14px] p-5 flex flex-col items-center text-center gap-2 hover:border-[#023E8A] transition-colors"
                        >
                          {partner.logo ? (
                            <img src={partner.logo} alt={partner.name} className="h-10 object-contain" />
                          ) : (
                            <div className="h-10 flex items-center text-[13px] font-bold text-[#023E8A]">
                              {partner.name}
                            </div>
                          )}
                          <p className="text-[11px] text-[#4E4F52] line-clamp-2">{partner.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#EEF0F2] rounded-[20px] px-10 py-12 text-center">
              <div className="w-14 h-14 rounded-[16px] bg-white border border-[#D7DBE0] flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-[#023E8A]" size={22} />
              </div>
              <h3 className="text-[17px] font-bold mb-2">New partners are being onboarded</h3>
              <p className="text-[13px] text-[#4E4F52] max-w-[440px] mx-auto leading-relaxed">
                We're currently formalizing our first supplier partnerships. Check
                back soon, or reach out below if you'd like to be one of the first
                listed here.
              </p>
            </div>
          )}
        </section>

        {/* CTA band */}
        <section className="max-w-[1180px] mx-auto px-6 pb-16 md:pb-20">
          <div className="bg-[#023E8A] rounded-[24px] px-8 py-12 md:py-14 text-center text-white">
            <h2 className="text-[22px] md:text-[26px] font-bold mb-3">
              Ready to list your stays or transfers, or explore ours?
            </h2>
            <p className="text-[13.5px] text-[#CBD8EE] max-w-[480px] mx-auto mb-6 leading-relaxed">
              Sign up at our partner portal to list your inventory on TravelMate or
              to use TravelMate's own listings.
            </p>
            <a
              href="https://partner.travelmateglo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#FF6F1E] text-white font-bold text-[14px] px-7 py-3.5 rounded-[9px] hover:brightness-95"
            >
              Get started at partner.travelmateglo.com
            </a>
            <p className="text-[12.5px] text-[#CBD8EE] mt-5">
              Have a different kind of integration in mind — where TravelMate connects
              to and consumes your own API directly?{" "}
              <a href="mailto:support@travelmateglo.com" className="underline font-semibold hover:text-white">
                Email support@travelmateglo.com
              </a>
              .
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

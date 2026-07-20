import { useCallback, useEffect, useState } from "react";
import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { InfoProvider } from "../features/account/api/info";
import Skeleton from "@mui/material/Skeleton";
import { usePageMeta } from "../hooks/usePageMeta";

// Shown when the backend-managed About content is empty or fails to load --
// previously this page rendered nothing at all in that case (an empty div),
// which is exactly what an evaluating partner or first-time visitor could
// hit. This is a stable fallback, not a replacement for the real editable
// content; the CMS copy still takes priority whenever it's actually there.
const FALLBACK_ABOUT_COPY = (
  <div className="space-y-4">
    <p>
      TravelMate brings stays, flights, and airport transfers together in one
      account, so planning a trip doesn't mean juggling a different app and a
      different login for each leg.
    </p>
    <p>
      Every stay, flight, and transfer on TravelMate is sourced through
      verified booking partners and priced in real time — the price you see
      at search is the price you pay at checkout, with cancellation terms
      shown before you book.
    </p>
    <p>
      Payments are processed securely through Flutterwave, and our support
      team is available to help with any booking, before or after you
      travel.
    </p>
  </div>
);

// Always shown, regardless of whether the CMS About content or the
// fallback above is what's rendering -- company identity facts an
// evaluating partner or visitor would look for shouldn't depend on
// whether an admin has filled in the About CMS entry.
const COMPANY_IDENTITY = [
  { label: "Company", value: "TravelMate Company" },
  { label: "Market", value: "Nigeria" },
  { label: "Support", value: "support@travelmateglo.com" },
];

export function AboutPage() {
  usePageMeta({
    title: "About Us | TravelMate",
    description:
      "Learn about TravelMate, the travel booking platform bringing stays, flights, and airport transfers together in one account.",
  });

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<{
    content: string;
    updated_at: string;
    id: string;
  } | null>(null);

  const getAbout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await InfoProvider.getAboutDetails();
      if (res) {
        setContent(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAbout();
  }, [getAbout]);
  return (
    <>
      <Navbar />
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-6 lg:space-y-8">
        <div>
          <p className="text-[#181818] hidden lg:block text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            About TravelMate
          </p>
          <p className="text-[#181818] lg:hidden text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            About Us
          </p>
          <div className="mt-6 text-sm lg:text-lg lg:mt-12">
            {loading ? (
              <div className="space-y-3">
                <Skeleton variant="text" width="92%" height={28} />
                <Skeleton variant="text" width="100%" height={28} />
                <Skeleton variant="text" width="96%" height={28} />
                <Skeleton variant="text" width="90%" height={28} />
                <Skeleton variant="text" width="84%" height={28} />
              </div>
            ) : content?.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: content.content,
                }}
              />
            ) : (
              FALLBACK_ABOUT_COPY
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-[#E4E7EB] grid grid-cols-1 sm:grid-cols-3 gap-6">
            {COMPANY_IDENTITY.map(({ label, value }) => (
              <div key={label}>
                <p className="text-[11px] font-bold uppercase tracking-[.5px] text-[#8A9096] mb-1">
                  {label}
                </p>
                <p className="text-[14px] font-medium text-[#181818]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { InfoProvider } from "../features/account/api/info";
import Skeleton from "@mui/material/Skeleton";
import { usePageMeta } from "../hooks/usePageMeta";
import { InfoPageHeader } from "../components/infoPages/InfoPageHeader";
import { CompanyConnectCard } from "../components/infoPages/CompanyConnectCard";
import { SanitizedHtml } from "../components/infoPages/SanitizedHtml";
import { HOTELS_ONLY, PRODUCTS_TEXT } from "../config/features";

// Shown when the backend-managed About content is empty or fails to load --
// previously this page rendered nothing at all in that case (an empty div),
// which is exactly what an evaluating partner or first-time visitor could
// hit. This is a stable fallback, not a replacement for the real editable
// content; the CMS copy still takes priority whenever it's actually there.
// Hotels-only launch: what's actually live (config/features.ts)
const HOTELS_ABOUT_COPY = (
  <div className="space-y-4">
    <p>
      TravelMate helps you find hotels, villas and resorts around the world:
      search by place and dates, compare stays, and see the details that
      matter before you book.
    </p>
    <p>
      Live prices, rooms and checkout are on our partner's secure booking
      page, where the hotel's cancellation terms are shown before you pay.
    </p>
    <p>Our support team is here to help with your trip, before or after you travel.</p>
  </div>
);

const ALL_PRODUCTS_ABOUT_COPY = (
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

const FALLBACK_ABOUT_COPY = HOTELS_ONLY ? HOTELS_ABOUT_COPY : ALL_PRODUCTS_ABOUT_COPY;

export function AboutPage() {
  usePageMeta({
    title: "About Us | TravelMate",
    description:
      `Learn about TravelMate, the travel booking platform for ${PRODUCTS_TEXT}.`,
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
      console.error(error);
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
      <InfoPageHeader
        eyebrow="Company"
        title="About TravelMate"
        subtitle={`Learn about TravelMate, the travel booking platform for ${PRODUCTS_TEXT}.`}
      />
      <section className="min-h-screen text-[#4E4F52] px-4 py-14">
        <div className="max-w-[680px] mx-auto text-[15.5px] leading-relaxed">
          {loading ? (
            <div className="space-y-3">
              <Skeleton variant="text" width="92%" height={28} />
              <Skeleton variant="text" width="100%" height={28} />
              <Skeleton variant="text" width="96%" height={28} />
              <Skeleton variant="text" width="90%" height={28} />
              <Skeleton variant="text" width="84%" height={28} />
            </div>
          ) : content?.content ? (
            <SanitizedHtml html={content.content} />
          ) : (
            FALLBACK_ABOUT_COPY
          )}
        </div>
        <CompanyConnectCard currentPage="about" />
      </section>
      <Footer />
    </>
  );
}

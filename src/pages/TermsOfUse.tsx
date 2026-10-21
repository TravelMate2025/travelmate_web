import { DateTime } from "luxon";
import { useState, useCallback, useEffect } from "react";
import Footer from "../components/2Footer";
import { InfoProvider } from "../features/account/api/info";
import Navbar from "./homePage/Navbar";
import Skeleton from "@mui/material/Skeleton";
import { usePageMeta } from "../hooks/usePageMeta";
import { InfoPageHeader } from "../components/infoPages/InfoPageHeader";
import { CompanyConnectCard } from "../components/infoPages/CompanyConnectCard";

export function TermsOfUsePage() {
  usePageMeta({
    title: "Terms of Use | TravelMate",
    description:
      "The terms that govern booking stays, flights, and airport transfers through TravelMate.",
  });

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<{
    content: string;
    updated_at: string;
    id: string;
  } | null>(null);

  const getContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await InfoProvider.getTermOfUse();
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
    getContent();
  }, [getContent]);

  const lastUpdatedAt = content?.updated_at
    ? DateTime.fromJSDate(new Date(content.updated_at))
    : DateTime.now();

  return (
    <>
      <Navbar />
      <InfoPageHeader
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="The terms that govern booking stays, flights, and airport transfers through TravelMate."
      />
      <section className="text-[#4E4F52] px-4 py-14">
        <div className="max-w-[680px] mx-auto text-[15.5px] leading-relaxed">
          <p className="text-[13px] text-[#8A9096] mb-8 pb-6 border-b border-[#EEF0F3]">
            Last Updated: {lastUpdatedAt.toFormat("LLL dd, yyyy")}
          </p>
          {loading ? (
            <div className="space-y-3">
              <Skeleton variant="text" width="94%" height={28} />
              <Skeleton variant="text" width="100%" height={28} />
              <Skeleton variant="text" width="97%" height={28} />
              <Skeleton variant="text" width="90%" height={28} />
              <Skeleton variant="text" width="82%" height={28} />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: content?.content ?? "",
              }}
            />
          )}
        </div>
        <CompanyConnectCard currentPage="terms" />
      </section>
      <Footer />
    </>
  );
}

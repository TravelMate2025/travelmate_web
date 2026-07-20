import { useState, useCallback, useEffect } from "react";
import Footer from "../components/2Footer";
import { InfoProvider } from "../features/account/api/info";
import Navbar from "./homePage/Navbar";
import Skeleton from "@mui/material/Skeleton";
import { DateTime } from "luxon";
import { usePageMeta } from "../hooks/usePageMeta";

export function PrivacyPolicyPage() {
  usePageMeta({
    title: "Privacy Policy | TravelMate",
    description:
      "How TravelMate collects, uses, and protects your data across stays, flights, and airport transfer bookings.",
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
      const res = await InfoProvider.getPrivacyPolicy();
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
      <section className="mt-[50px] min-h-screen lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-8">
        <div>
          <p className="text-[#181818] font-semibold text-2xl text-center lg:text-left lg:text-4xl">
            Privacy Policy
          </p>
          <p className="text-sm lg:mt-2  lg:text-lg mt-6">
            Last Updated: {lastUpdatedAt.toFormat("LLL dd, yyyy")}
          </p>
        </div>
        <div className="mt-6 text-sm lg:text-lg lg:mt-12">
          {loading ? (
            <div className="space-y-3">
              <Skeleton variant="text" width="92%" height={28} />
              <Skeleton variant="text" width="100%" height={28} />
              <Skeleton variant="text" width="97%" height={28} />
              <Skeleton variant="text" width="90%" height={28} />
              <Skeleton variant="text" width="84%" height={28} />
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: content?.content ?? "",
              }}
            />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

import { DateTime } from "luxon";
import { useState, useCallback, useEffect } from "react";
import Footer from "../components/2Footer";
import { InfoProvider } from "../features/account/api/info";
import Navbar from "./homePage/Navbar";
import Skeleton from "@mui/material/Skeleton";
import { usePageMeta } from "../hooks/usePageMeta";

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
  
      const lastUpdatedAt = content?.updated_at ? DateTime.fromJSDate(new Date(content.updated_at)): DateTime.now()

  return (
    <>
      <Navbar />
      <section className="mt-[50px] lg:mt-[100px] text-sm lg:text-lg text-[#4E4F52] max-w-[1240px] mx-auto px-4 py-10 space-y-6 lg:space-y-8">
        <div>
          <p className="text-[#181818] text-center lg:text-left font-semibold text-2xl lg:text-4xl">
            Terms of Use
          </p>
          <p className="text-sm lg:text-lg mt-2">Last Updated: {lastUpdatedAt.toFormat("LLL dd, yyyy")}</p>
        </div>
        <div className="mt-6 text-sm lg:text-lg lg:mt-12">
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
      </section>
      <Footer />
    </>
  );
}

import { useState, useCallback, useEffect } from "react";
import Footer from "../components/2Footer";
import { InfoProvider } from "../features/account/api/info";
import Navbar from "./homePage/Navbar";
import { Skeleton } from "antd";
import { DateTime } from "luxon";

export function PrivacyPolicyPage() {
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
            <Skeleton active paragraph={{ rows: 5 }} />
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

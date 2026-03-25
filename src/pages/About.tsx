import { useCallback, useEffect, useState } from "react";
import Footer from "../components/2Footer";
import Navbar from "./homePage/Navbar";
import { InfoProvider } from "../features/account/api/info";
import { Skeleton } from "antd";

export function AboutPage() {
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
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: content?.content ?? "",
                }}
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

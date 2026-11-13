import { Link } from "react-router-dom";
import Footer from "../components/2Footer";
import { usePageMeta } from "../hooks/usePageMeta";
import Navbar from "./homePage/Navbar";

// Any address the site doesn't have, including products that are switched off
// (config/features.ts), so old or shared links never show a blank page.
export const NotFoundPage = () => {
  usePageMeta({ title: "Page not found | TravelMate", description: "We couldn't find that page on TravelMate." });
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#181818]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-32 text-center">
        <h1 className="text-[1.75rem] font-bold">We can’t find that page</h1>
        <p className="text-[#4E4F52]">The link may be old, or the page may have moved.</p>
        <Link to="/" className="inline-flex min-h-12 items-center rounded-xl bg-[#023E8A] px-6 font-bold text-white no-underline hover:bg-[#012A5D]">
          Go to the home page
        </Link>
      </main>
      <Footer />
    </div>
  );
};

// Default export for React.lazy in App.tsx
export default NotFoundPage;

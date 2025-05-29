import { useEffect, useState } from "react";
import { getFaqCategories } from "../api/faqs";
import FaqTabs from "../components/faq/FaqTabs";
import FaqAccordion from "../components/faq/FaqAccordion";
import Navbar from "./homePage/Navbar";
import Footer from "../components/2Footer";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

const FaqPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const preferredOrder = ["Stays", "Flights", "Car Rentals", "Account"];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqCategories();
        const transformed = data.map((cat: any) => ({
          ...cat,
          short_name: cat.name_display.split(" ")[0],
        }));

        const sorted = transformed.sort(
          (a: any, b: any) =>
            preferredOrder.indexOf(a.name_display) -
            preferredOrder.indexOf(b.name_display)
        );

        setCategories(sorted);
        if (sorted.length > 0) setSelectedCategoryId(sorted[0].id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <>
      <Navbar />
      <div className="max-w-[1390px] mx-auto mt-13 md:mt-20 md:px-4 py-8 min-h-[400px]">
        <div className="flex items-center md:hidden px-4 py-2">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md p-2"
          >
            <IoChevronBack size={24} />
          </button>
    
          <h1 className="text-2xl font-bold ml-24">FAQs</h1>
        </div>
        <h1 className="text-3xl font-bold ml-6 hidden md:block md:ml-0 mb-6">Frequently Asked Questions (FAQs)</h1>

        {loading ? (
          <div className="flex flex-col p-4 md:flex-row gap-6 animate-pulse">
            {/* Tabs skeleton */}
            <div className="w-full md:w-1/3 flex md:flex-col flex-row gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-md h-10 w-full md:w-full flex-1"
                />
              ))}
            </div>

            {/* Accordion skeleton */}
            <div className="flex-1 space-y-4 mt-6 md:mt-0">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-20 bg-gray-200 rounded-md w-full"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
         ) : categories.length === 0 ? (
          <div className="text-center w-full py-12">
            <h2 className="text-xl font-semibold text-gray-700">No FAQs available</h2>
            <p className="text-gray-500 mt-2">We couldn’t find any FAQ categories at the moment. Please check back later.</p>
          </div>
        ) : (


          <div className="flex flex-col md:flex-row items-start gap-6">
            <FaqTabs
              categories={categories}
              selectedCategoryId={selectedCategoryId!}
              onSelect={setSelectedCategoryId}
            />
            {selectedCategory && <FaqAccordion faqs={selectedCategory.faqs} />}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FaqPage;

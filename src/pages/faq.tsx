import { useEffect, useState } from "react";
import { getFaqCategories } from "../api/faqs";
import FaqTabs from "../components/faq/FaqTabs";
import FaqAccordion from "../components/faq/FaqAccordion";
import Navbar from "./homePage/Navbar";
import Footer from "../components/2Footer";

const FaqPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqCategories();
        setCategories(data);
        if (data.length > 0) setSelectedCategoryId(data[0].id);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

    const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

    const preferredOrder = ["Stays", "Flights", "Car Rentals", "Account"];

    const sortedCategories = categories.sort(
    (a, b) =>
        preferredOrder.indexOf(a.name_display) - preferredOrder.indexOf(b.name_display)
    );


  return (
    <>
    <Navbar />
    <div className="max-w-[1390px] mx-auto mt-20 px-4 py-8 min-h-[400px]">
        
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions (FAQs)</h1>

      {loading ? (
        <p>Loading FAQs...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="flex flex-col md:flex-row items-start gap-6">
          <FaqTabs
            categories={sortedCategories}
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

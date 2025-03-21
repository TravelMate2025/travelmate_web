import { useState } from "react";
import { AiOutlineCar } from "react-icons/ai";
import { GiCommercialAirplane, GiFamilyHouse } from "react-icons/gi";
import Navbar from "../components/2Navbar";
import Footer from "../components/2Footer";
// import PopularDestinations from "../components/2PopularDestinations";
import DownloadApp from "../components/2DownloadApp";
import NewsletterSubscription from "../components/2SubscribeNewsletter";

export default function Home2() {
  const [activeTab, setActiveTab] = useState("stays");
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ destination, guests, date });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-white py-6 px-6 md:px-10 shadow-lg border border-gray-300 rounded-2xl max-w-full mx-4 md:mx-14 mt-10">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center space-x-6 border-b-2 border-gray-300 w-full text-center">
          {[
            { label: "Stays", icon: <GiFamilyHouse size={20} color="gray" /> },
            { label: "Flights", icon: <GiCommercialAirplane size={20} color="gray" /> },
            { label: "Cars", icon: <AiOutlineCar size={20} color="gray" /> },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center text-gray-700 font-semibold text-lg relative pb-2 ${
                activeTab === tab.label.toLowerCase() ? "text-blue-600" : ""
              }`}
              onClick={() => setActiveTab(tab.label.toLowerCase())}
            >
              {tab.icon} <span className="ml-2">{tab.label}</span>
              {activeTab === tab.label.toLowerCase() && (
                <span className="absolute left-0 bottom-0 w-full h-1 bg-orange-500"></span>
              )}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-end">
          {/* Destination Input */}
          <div>
            <label className="block text-gray-600 font-bold mb-1">Destination</label>
            <input
              type="text"
              placeholder="Search Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Rooms & Guests Input */}
          <div>
            <label className="block text-gray-600 font-bold mb-1">Rooms & Guests</label>
            <input
              type="text"
              placeholder="1 Room, 1 Guest"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-gray-600 font-bold mb-1">Date</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Select Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={(e) => {
                e.target.type = "date";
                e.target.showPicker();
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              required
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-[120px] bg-[#023E8A] text-white py-2 rounded-lg hover:bg-[#012A5D] transition justify-self-end"
          >
            Search
          </button>
        </form>
      </section>

      {/* <PopularDestinations /> */}
      <DownloadApp />
      <NewsletterSubscription />
      <Footer />
    </div>
  );
}

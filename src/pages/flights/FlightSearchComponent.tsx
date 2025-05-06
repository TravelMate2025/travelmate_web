import { useState, ChangeEvent } from "react";
import { Calendar, User, MapPin, RockingChair } from "lucide-react";

type TripType = "roundTrip" | "oneWay" | "multiCity";

interface FormData {
    from: string;
    to: string;
    date: string;
    returnDate: string;
    passengers: string;
    class: string;
}

const FlightSearchComponent = () => {
    const [tripType, setTripType] = useState<TripType>("roundTrip");
    const [formData, setFormData] = useState<FormData>({
        from: "",
        to: "",
        date: "",
        returnDate: "",
        passengers: "1",
        class: "Economy"
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSearch = () => {
        console.log("Search Form Data:", { tripType, ...formData });
    };

    return (
        <div className="w-[90%] mx-auto mt-16 md:mt-24 bg-white rounded-lg border border-gray-200 shadow">
            <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">Fly To Your Dream Destinations</h1>
                <p className="text-gray-600 mt-1">Discover the best flight deals and book hassle-free.</p>
            </div>

            <div className="px-6 py-2 border-t border-gray-200">
                <div className="flex flex-wrap gap-6 mt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            className="w-4 h-4 text-blue-600"
                            checked={tripType === "roundTrip"}
                            onChange={() => setTripType("roundTrip")}
                        />
                        <span className="text-gray-800">Round Trip</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            className="w-4 h-4 text-blue-600"
                            checked={tripType === "oneWay"}
                            onChange={() => setTripType("oneWay")}
                        />
                        <span className="text-gray-800">One Way</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            className="w-4 h-4 text-blue-600"
                            checked={tripType === "multiCity"}
                            onChange={() => setTripType("multiCity")}
                        />
                        <span className="text-gray-800">Multi City</span>
                    </label>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 items-end">
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">From</label>
                    <div className="relative">
                        <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <MapPin size={18} className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                name="from"
                                value={formData.from}
                                onChange={handleInputChange}
                                placeholder="Search Destination"
                                className="w-full text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">To</label>
                    <div className="relative">
                        <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <MapPin size={18} className="text-gray-500 mr-2" />
                            <input
                                type="text"
                                name="to"
                                value={formData.to}
                                onChange={handleInputChange}
                                placeholder="Search Destination"
                                className="w-full text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Date</label>
                    <div className="relative">
                        <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <Calendar size={18} className="text-gray-500 mr-2" />
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {tripType === "roundTrip" && (
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Return Date</label>
                        <div className="relative">
                            <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                <Calendar size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleInputChange}
                                    className="w-full text-gray-700 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Passenger</label>
                    <div className="relative">
                        <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <User size={18} className="text-gray-500 mr-2" />
                            <input
                                type="number"
                                name="passengers"
                                min="1"
                                value={formData.passengers}
                                onChange={handleInputChange}
                                className="w-full text-gray-700 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Class</label>
                    <div className="relative">
                        <div className="flex items-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <RockingChair size={16} className="text-gray-500 mr-2" />
                            <select
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                className="w-full text-gray-700 focus:outline-none bg-transparent"
                            >
                                <option value="Economy">Economy</option>
                                <option value="Premium Economy">Premium Economy</option>
                                <option value="Business">Business</option>
                                <option value="First Class">First Class</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="">
                    <button 
                        onClick={handleSearch}
                        className="w-full bg-[#023E8A] hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlightSearchComponent;
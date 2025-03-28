import { useState } from "react";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import ReusableDateSelector from "../components/ReusableDateSelector";



export default function UpdateSearchFilter() {
    // State for search filters
    const [date, setDate] = useState("");
    const [destination, setDestination] = useState("");
    const [roomGuest, setRoomGuest] = useState("");


    // Handle form submission
    const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log({ destination, roomGuest, date });
    };

    const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
    };



    return (
        <div>
            {/* Search Filter Section */}
        <div className="bg-gray-100 py-6 px-4 sm:px-10 shadow-md">
            <div className="max-w-[1280px] mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 md:gap-4">
                
                {/* Destination */}
                <div className="flex flex-col w-full md:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-1">Destination</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaMapMarkerAlt />
                    </span>
                    <input
                    type="text"
                    value={destination}
                    onChange={(e) => e.target.value.length <= 45 && setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full md:w-[312px] h-[44px] border px-10 rounded-lg text-gray-700 focus:outline-blue-600"
                    required
                    />
                </div>
                </div>

                {/* Room & Guest */}
                <div className="flex flex-col w-full md:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-1">Room & Guest</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <FaUser />
                    </span>
                    <input
                    type="text"
                    value={roomGuest}
                    onChange={(e) => e.target.value.length <= 45 && setRoomGuest(e.target.value)}
                    placeholder="Number of rooms & guests"
                    className="w-full md:w-[312px] h-[44px] border px-10 rounded-lg text-gray-700 focus:outline-blue-600"
                    required
                    />
                </div>
                </div>

                {/* Date */}
                <div className="flex flex-col w-full md:w-auto">
                <label className="text-sm font-medium text-gray-700 mb-1">Date</label>
                <ReusableDateSelector onDateChange={handleDateChange} initialValue={date} />
                </div>

                {/* Submit Button */}
                <div className="flex-grow"></div>
                <button
                type="submit"
                className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg hover:bg-[#0450A2]"
                >
                Update
                </button>
            </form>
            </div>
        </div>
    </div>

    );



}


       
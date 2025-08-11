import { useState } from "react";
import ReusableDateSelector from "./ReusableDateSelector";
import HotelGuestSelector from "./HotelGuestSelector";
import LocationDropdown from "./booking-progress/LocationDropdown";

export default function UpdateSearchFilter() {
    // State for search filters
    const [date, setDate] = useState("");
    const [destination, setDestination] = useState("");
    const [locations, setLocations] = useState(["Lagos", "Abuja", "Kano"]);
    const [roomGuest] = useState("");
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [guestText, setGuestText] = useState("1 Room, 2 Guests");
    const [counts, setCounts] = useState({ rooms: 1, adults: 2, children: 0, infants: 0 });
    

    // Handle form submission
    const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log({ destination, roomGuest, date });
    };

    const handleDateChange = (selectedDate: string) => {
    setDate(selectedDate);
    };


    const handleIncrement = (key: keyof typeof counts) => {
        setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    };
    
    const handleDecrement = (key: keyof typeof counts) => {
        setCounts((prev) => ({ ...prev, [key]: Math.max(prev[key] - 1, 0) }));
    };
    
    const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);
    
    const updateGuestText = () => {
        const totalGuests = counts.adults + counts.children + counts.infants;
        setGuestText(`${counts.rooms} Room${counts.rooms > 1 ? "s" : ""}, ${totalGuests} Guest${totalGuests !== 1 ? "s" : ""}`);
        handleClose();
    };

    const handleRemoveLocation = (loc: string) => {
        setLocations((prev) => prev.filter((item) => item !== loc));
    };


    return (
        <div>
            {/* Search Filter Section */}
        <div className="bg-gray-100 py-6 px-4 sm:px-10 shadow-md">
            <div className="max-w-[1280px] mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 md:gap-4">
                
                {/* Destination */}
                <div className="flex flex-col w-full md:w-auto">
                    <LocationDropdown
                    label="Destination"
                    selectedValue={destination}
                    setSelectedValue={setDestination}
                    locations={locations}
                    onRemoveLocation={handleRemoveLocation}
                    />
                </div>

            
                <div className="flex flex-col w-full md:w-auto">
                            <HotelGuestSelector
                              guestText={guestText}
                              handleOpen={handleOpen}
                              guestAnchor={anchor}
                              handleClose={handleClose}
                              handleIncrement={handleIncrement}
                              handleDecrement={handleDecrement}
                              counts={counts}
                              updateGuestText={updateGuestText}
                            />
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


       
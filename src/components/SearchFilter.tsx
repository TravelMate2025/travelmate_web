import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableDateSelector from "../components/ReusableDateSelector";
import LocationDropdown from './booking-progress/LocationDropdown';
import HotelGuestSelector from './HotelGuestSelector';

// We will use localStorage to pass the search parameters to the results page
interface SearchParams {
    destination: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
}

const SearchFilter: React.FC = () => {
    const [destination, setDestination] = useState("");
    const [locations] = useState(["Lagos", "Abuja", "Kano"]); // Static locations for dropdown
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [guestText, setGuestText] = useState("1 Room, 2 Guests");
    const [counts, setCounts] = useState({ rooms: 1, adults: 2, children: 0, infants: 0 });

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Store the search parameters in localStorage to be retrieved by StaysSearchResults
        const searchParams: SearchParams = {
            destination: destination,
            checkIn: checkIn,
            checkOut: checkOut,
            adults: counts.adults,
            children: counts.children,
        };
        localStorage.setItem('hotelSearchParams', JSON.stringify(searchParams));

        navigate('/stays-search-result');
    };

    const handleDateChange = (startDate: string, endDate: string) => {
        setCheckIn(startDate);
        setCheckOut(endDate);
    };

    const handleRemoveLocation = (loc: string) => {
        // This function can remain as is if you still want to handle removing locations from the dropdown
        // but it doesn't affect the API call
        setLocations((prev) => prev.filter((item) => item !== loc));
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

    return (
        <div className="py-4">
            <div className="max-w-full mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
                        <label className="text-sm font-medium text-gray-700 mb-1">Check-in - Check-out</label>
                        {/* The ReusableDateSelector component needs to be updated to handle a date range */}
                        <ReusableDateSelector onDateChange={handleDateChange} initialValue={""} />
                    </div>

                    {/* Submit Button */}
                    <div className="flex-grow"></div>
                    <button
                        type="submit"
                        className="w-full md:w-35 h-[42px] bg-[#023E8A] text-white rounded-lg cursor-pointer hover:bg-[#0450A2]"
                    >
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchFilter;
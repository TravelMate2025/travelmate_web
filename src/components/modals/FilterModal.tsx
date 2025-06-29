import { useState } from "react";
import RangeSlider from "./RangeSlider";
import { FaStar } from "react-icons/fa";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilter: (filters: { priceRange: number[]; selectedStars: number | null; amenities: string[]; propertyTypes: string[] }) => void;
}

export default function FilterModal({ isOpen, onClose, onApplyFilter }: FilterModalProps) {
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [selectedStars, setSelectedStars] = useState<number | null>(null);
    const [amenities, setAmenities] = useState<string[]>([]);
    const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

    if (!isOpen) return null;

    const handleClearAll = () => {
        setPriceRange([0, 1000000]);
        setSelectedStars(null);
        setAmenities([]);
        setPropertyTypes([]);
    };

    const handleApply = () => {
        onApplyFilter({ priceRange, selectedStars, amenities, propertyTypes });
        onClose();
    };

    const formatPrice = (price: number) => `₦${price.toLocaleString()}`;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 z-[1200]">
            <div className="w-[350px] max-h-[600px] bg-white rounded-lg shadow-3xl shadow-[0_6px_30px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-gray-300">
                    <button className="text-[#023E8A] text-sm font-semibold" onClick={handleClearAll}>
                        Clear All
                    </button>
                    <h2 className="text-lg font-semibold">Filter By</h2>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md" onClick={onClose}>
                        ✖
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto p-6">

                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <RangeSlider value={priceRange} onChange={setPriceRange} />
                        <div className="flex gap-4 mt-2">
                            {["Minimum", "Maximum"].map((label, index) => (
                                <div key={label} className="flex-1">
                                    <label className="text-xs text-gray-600">{label}</label>
                                    <input
                                        type="text"
                                        value={formatPrice(priceRange[index])}
                                        className="w-full border border-gray-500 rounded-md p-2"
                                        readOnly
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium">Star Rating</h3>
                        <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`flex items-center gap-1 px-2 py-2 border border-gray-300 rounded-lg ${
                                        selectedStars === star ? "bg-yellow-400 text-white" : "bg-white"
                                    }`}
                                    onClick={() => setSelectedStars(star)}
                                >
                                    <span>{star}</span>
                                    <FaStar className="text-orange-500" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="my-4 border-gray-300" />

                    {/* Amenities */}
                    <div>
                        <h3 className="text-sm font-medium">Amenities</h3>
                        {["Wifi", "Air Conditioning", "Pool", "Free Parking"].map((amenity) => (
                            <label key={amenity} className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={amenities.includes(amenity)}
                                    onChange={() =>
                                        setAmenities((prev) =>
                                            prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
                                        )
                                    }
                                    className="w-5 h-5"
                                />
                                {amenity}
                            </label>
                        ))}
                    </div>

                    <hr className="my-4 border-gray-300" />

                    {/* Property Type */}
                    <div>
                        <h3 className="text-sm font-medium">Property Type</h3>
                        {["Hotel", "Hostel", "Apartment", "Resort"].map((property) => (
                            <label key={property} className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={propertyTypes.includes(property)}
                                    onChange={() =>
                                        setPropertyTypes((prev) =>
                                            prev.includes(property) ? prev.filter((item) => item !== property) : [...prev, property]
                                        )
                                    }
                                    className="w-5 h-5"
                                />
                                {property}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply Button Fixed at Bottom */}
                <div className="p-4 border-t border-gray-300 bg-white sticky bottom-0">
                    <button
                        className="w-full bg-[#023E8A] text-white py-3 rounded-lg"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                </div>

            </div>
        </div>
    );
}
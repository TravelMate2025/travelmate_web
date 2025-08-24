import React from "react";
import { useMediaQuery } from "react-responsive";
import { BookingFormData } from "../types/booking";
import { Button, Skeleton } from "@mui/material";

interface CarListProps {
  departureInfo: BookingFormData;
  searchResults: any; // API response with results.services
  loading: boolean; // New prop for search loading state
  OpenForm: () => void;
}

const CarList: React.FC<CarListProps> = ({ departureInfo, searchResults, loading, OpenForm }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Extract services and fallback guidance
  const services = searchResults?.results?.services || [];
  const fallbackGuidance = searchResults?.results?.fallback?.user_guidance || {};

  return (
    <div className="car-list-container px-4 lg:px-24 py-8">
      {/* Header with Trip Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Transfer from {departureInfo.pickUpLocaDescription} to {departureInfo.dropoffLocation}
          </h2>
          <p className="text-gray-600">
            {departureInfo.pickupDate} at {departureInfo.pickupTime} |{" "}
            {departureInfo.passengerCounts.adults +
              departureInfo.passengerCounts.children +
              departureInfo.passengerCounts.infant}{" "}
            Passengers | {departureInfo.selectedRide}
          </p>
        </div>
      </div>

      {/* Skeleton Loader or Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="text" width="50%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2, borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {service.vehicle_type || "Standard Vehicle"}
              </h3>
              <p className="text-gray-600 mt-2">
                Provider: {service.provider_name || "Unknown Provider"}
              </p>
              <p className="text-gray-600">
                Price: ${service.price || "N/A"}
              </p>
              <p className="text-gray-600">
                Duration: {service.duration || "N/A"} minutes
              </p>
              <p className="text-gray-600">
                Passengers: Up to {service.max_passengers || "N/A"}
              </p>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#FF6F1E",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  textTransform: "none",
                  fontWeight: 500,
                  marginTop: "1rem",
                  width: "100%",
                }}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <h3 className="font-semibold text-lg">
            {fallbackGuidance.message || "No transfer services found"}
          </h3>
          {fallbackGuidance.suggestions && (
            <div className="mt-2">
              <p className="font-medium">Suggestions:</p>
              <ul className="list-disc pl-5">
                {fallbackGuidance.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            variant="outlined"
            onClick={OpenForm}
            sx={{
              borderColor: "#023E8A",
              color: "#023E8A",
              borderRadius: "8px",
              padding: "8px 16px",
              textTransform: "none",
              fontWeight: 500,
              marginTop: "1rem",
            }}
          >
            Try Another Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarList;

"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Airport } from "../types";
import axios from "axios";
import toast from "react-hot-toast";

export type Flight = {
  id?: number;
  from: Airport | null;
  to: Airport | null;
  date: string;
};
export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export type DateSelection = Date | { startDate: Date; endDate: Date } | null;
 
export type SearchData =  {
    from: Airport | undefined;
    to: Airport | undefined;
    formattedDate: string;
    date: DateSelection | undefined;
    flightClass: string;
    passengers: PassengerCounts;
    tripType: string;
    country: string;
    flights: Flight[] | {
        from: Airport | undefined;
        to: Airport | undefined;
        date: DateSelection | undefined;
    }[] | undefined;
}
export const useFlightBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tripType, setTripType] = useState<string>(
    () => sessionStorage.getItem("tripType") || "round-trip"
  );

  const [selectedFrom, setSelectedFrom] = useState<Airport | null>(null);
  const [selectedTo, setSelectedTo] = useState<Airport | null>(null);

  const [selectedDate, setSelectedDate] = useState<DateSelection>(new Date());

  const [selectedClass, setSelectedClass] = useState("Economy");

  const [passengerCounts, setPassengerCounts] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });
const emptyAirport: Airport = { id: "",  cityName:"", countryCode:"", countryName:"", displayName:"", geoCode:{latitude:0,longitude:0}, iataCode:"", name:"", priority:0, type:"AIRPORT" };
const [flights, setFlights] = useState<Flight[]>(() => {
  const receivedFlights = location.state?.flights as Flight[] | undefined;

  return (
    receivedFlights || [
      { id: 1, from: emptyAirport, to: emptyAirport, date: "" },
      { id: 2, from: emptyAirport, to: emptyAirport, date: "" },
    ]
  );
});


      const [country, setCountry] = useState<string>("Detecting...");
  
      useEffect(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
  
              try {
                // Call OpenStreetMap Nominatim API to reverse geocode
                const res = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`
                );
                const data = await res.data;
              
                
                setCountry(data?.address?.country || "Unknown");
              } catch (error) {
                toast.error("Geolocation lookup failed:");
                setCountry("Error detecting country");
              }
            },
            (_error) => {
              toast.error("Geolocation error:", );
              setCountry("Permission denied or unavailable");
            },
            {
               enableHighAccuracy: true, 
             }
          );
        } else {
        toast.error("Geolocation is not supported by this browser.");
        }
      }, []);


  const updateFlight = useCallback(
    (id: number, field: keyof Flight, value: string) => {
      setFlights((prev) =>
        prev.map((flight) =>
          flight.id === id ? { ...flight, [field]: value } : flight
        )
      );
    },
    []
  );





  const getFormattedDate = (date?: DateSelection) => {
    if (!date) return "";
    if (date instanceof Date) return format(date, "yyyy-MM-dd");
    return `${format(date.startDate, "yyyy-MM-dd")} to ${format(
      date.endDate,
      "yyyy-MM-dd"
    )}`;
  };

  const handleSearch = useCallback(
    (
      flightClass: string,
      passengers: PassengerCounts,
      date?: DateSelection,
      from?: Airport,
      to?: Airport,
      flights?: Flight[]
    ) => {
      const formattedDate = getFormattedDate(date);


      const searchData = {
        from,
        to,
        formattedDate,
        date,
        flightClass,
        passengers,
        tripType,
        country,
        flights: tripType === "multi-city" ? flights : [{ from, to, date }],
      };

      sessionStorage.setItem("trip", JSON.stringify(searchData));
      if (location.pathname === "/") {
        if (tripType === "multi-city") {
          navigate("/flight/departure", { state: searchData });
        } else {
          navigate("/flight/departure", { state: searchData });
        }
      }
    },
    [
      tripType,
      selectedFrom,
      selectedTo,
  

      selectedClass,
      passengerCounts,
      flights,
      navigate,
    ]
  );

  useEffect(() => {
    sessionStorage.setItem("tripType", tripType);
  }, [tripType]);
const isCountryReady =
  country &&
  country !== "Detecting..." &&
  country !== "Unknown" &&
  !country.startsWith("Error") &&
  country !== "Permission denied or unavailable" &&
    country !== "Geolocation not supported";

  
  return {
    // State
    tripType,
    selectedFrom,
    selectedTo,
    selectedDate,
    selectedDateString: getFormattedDate(selectedDate),
    selectedClass,
    passengerCounts,
    isCountryReady,
    flights,

    // Actions
    setTripType,
    setSelectedFrom,
    setSelectedTo,
    setSelectedDate,
    setSelectedClass,
    setPassengerCounts,
    updateFlight,

    handleSearch,
  };
};

import { PassengerCounts } from "../types/booking";
import { PriceRange } from "../types/booking";
import { BookingFormData } from "../types/booking";
import { FormValidationResult } from "../types/booking";
import format from "date-fns/format";

export const formatPassengerCount = (counts: PassengerCounts): string => {
  const { adults, children, infant } = counts;
  const parts: string[] = [];

  if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} child${children > 1 ? "ren" : ""}`);
  if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "Select Passengers";
};

export const formatPriceRange = (priceRange: PriceRange): string => {
  const { min, max } = priceRange;
  if (min === 0 && max === 0) {
    return "Select Price Range";
  }
  return `₦${new Intl.NumberFormat().format(min)} - ₦${new Intl.NumberFormat().format(max)}`;
};

export const formatDate = (date: Date): string => format(date, "dd MMM yyyy");
export const formatApiDate = (date: Date): string => format(date, "yyyy-MM-dd");

// utils/validation.ts
export const validateBookingForm = (formData: BookingFormData): FormValidationResult => {
  const errors: Record<string, string> = {};

  if (!formData.pickupLocation?.trim()) {
    errors.pickupLocation = "Pick up location is required";
  }

  if (!formData.dropoffLocation?.trim()) {
    errors.dropoffLocation = "Drop off location is required";
  }

  if (!formData.pickupDate) {
    errors.pickupDate = "Pick up date is required";
  }

  if (!formData.pickupTime) {
    errors.pickupTime = "Pick up time is required";
  }

  if (!formData.selectedRide) {
    errors.selectedRide = "Ride type is required";
  }
    if (!formData.priceRange.min || !formData.priceRange.max) {
    errors.priceRange= "Price Range is required";
  }


  if (formData.priceRange.min >= formData.priceRange.max && formData.priceRange.max > 0) {
    errors.priceRange = "Maximum price should be greater than minimum price";
  }

  const totalPassengers = formData.passengerCounts.adults + 
                          formData.passengerCounts.children + 
                          formData.passengerCounts.infant;
  
  if (totalPassengers === 0) {
    errors.passengers = "At least one passenger is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
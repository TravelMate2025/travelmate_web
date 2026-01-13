import { FormValidationResult } from "../types/booking";
import { BookingFormData } from "../types/booking";

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
        errors.priceRange = "Price Range is required";
    }
    if (formData.pickupDate && formData.pickupTime) {
        const dateTimeString = `${formData.pickupDate}T${formData.pickupTime}`;
        const pickupDateTime = new Date(dateTimeString);

        if (isNaN(pickupDateTime.getTime())) {
            errors.pickupTime = "Invalid pickup date/time";
        } else if (pickupDateTime.getTime() <= Date.now()) {
            errors.pickupTime = "Pickup time must be in the future";
        }
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
    if (formData.passengerCounts.adults === 0 &&
        (formData.passengerCounts.children > 0 || formData.passengerCounts.infant > 0)) {
        errors.passengers = "Children/infants must be accompanied by at least one adult";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
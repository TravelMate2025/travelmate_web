import { useState, useCallback, useMemo } from 'react';
import { BookingFormData } from '../types/booking';
import { validateBookingForm } from '../utilities/formatting';

export const useBookingForm = (initialData?: Partial<BookingFormData>) => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: initialData?.pickupLocation || "",
    pickUpLocaDescription: initialData?.pickUpLocaDescription||"",
    dropoffLocation: initialData?.dropoffLocation || "",
    pickupDate: initialData?.pickupDate || "",
    pickupTime: initialData?.pickupTime || "",
    selectedRide: initialData?.selectedRide || "",
    priceRange: initialData?.priceRange || { min: 0, max: 0 },
    passengerCounts: initialData?.passengerCounts || { adults: 0, children: 0, infant: 0 },
    endAddress: initialData?.endAddress || "",
    endCity: initialData?.endCity || "",
    endCountry: initialData?.endCountry || "",
    endGeoLat: initialData?.endGeoLat || 0,
    endGeoLong: initialData?.endGeoLong || 0,
    
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Memoized validation
  const validation = useMemo(() => validateBookingForm(formData), [formData]);

  // Update specific field
  const updateField = useCallback(<K extends keyof BookingFormData>(
    field: K,
    value: BookingFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateFields = useCallback((updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      pickupLocation: "",
      pickUpLocaDescription:"",
      dropoffLocation: "",
      pickupDate: "",
      pickupTime: "",
      selectedRide: "",
      priceRange: { min: 0, max: 0 },
      passengerCounts: { adults: 0, children: 0, infant: 0 },
      endAddress: "",
      endCity: "Paris",
      endCountry: "FR",
      endGeoLat: 48.859466,
      endGeoLong: 2.2976965,
    });
    setErrors({});
    setSubmitError(null);
  }, []);

  return {
    formData,
    setFormData,
    errors: validation.errors,
    isValid: validation.isValid,
    loading,
    submitError,
    updateField,
    updateFields,
    resetForm,
    setLoading,
    setSubmitError,
  };
};

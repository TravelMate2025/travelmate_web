import { useState, useCallback, useMemo } from 'react';
import { BookingFormData } from '../types/booking';
import { validateBookingForm } from '../utilities/formatting';

export const useBookingForm = (initialData?: Partial<BookingFormData>) => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: initialData?.pickupLocation || "",
    pickUpLocaDescription: initialData?.pickUpLocaDescription||"",
    dropoffLocation: initialData?.dropoffLocation || "",
    dropoffLocaDescription: initialData?.dropoffLocaDescription||"",
    pickupDate: initialData?.pickupDate || "",
    pickupTime: initialData?.pickupTime || "",
    selectedRide: initialData?.selectedRide || "",
    priceRange: initialData?.priceRange || { min: 0, max: 0 },
    passengerCounts: initialData?.passengerCounts || { adults: 0, children: 0, infant: 0 },
    endAddress: initialData?.endAddress || "",
    endCity: initialData?.endCity || "",
    endCountry: initialData?.endCountry || "",
    toLat: initialData?.toLat || undefined,
    toLon: initialData?.toLon || undefined,
    searchResults: initialData?.searchResults || [],
    search_id: initialData?.search_id || "",
    rate_key: initialData?.rate_key || "",
    
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
      dropoffLocaDescription:"",
      pickupDate: "",
      pickupTime: "",
      selectedRide: "",
      priceRange: { min: 0, max: 0 },
      passengerCounts: { adults: 0, children: 0, infant: 0 },
      endAddress: "",
      endCity: "",
      endCountry: "",
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

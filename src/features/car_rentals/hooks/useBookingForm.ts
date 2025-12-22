import { useState, useCallback, useMemo } from 'react';
import { BookingFormData } from '../types/booking';
import { validateBookingForm } from '../utilities/validation';

interface TouchedFields {
  pickupLocation?: boolean;
  dropoffLocation?: boolean;
  pickupDate?: boolean;
  pickupTime?: boolean;
  selectedRide?: boolean;
  priceRange?: boolean;
  passengers?: boolean;
}

export const useBookingForm = (initialData?: Partial<BookingFormData>) => {
  const [formData, setFormData] = useState<BookingFormData>({
    pickupLocation: initialData?.pickupLocation || "",
    pickupLocaDescription: initialData?.pickupLocaDescription || "",
    dropoffLocation: initialData?.dropoffLocation || "",
    dropoffLocaDescription: initialData?.dropoffLocaDescription || "",
    pickupDate: initialData?.pickupDate || "",
    pickupTime: initialData?.pickupTime || "",
    selectedRide: initialData?.selectedRide || "",
    priceRange: initialData?.priceRange || { min: 0, max: 0 },
    passengerCounts: initialData?.passengerCounts || { adults: 0, children: 0, infant: 0 },
    toLat: initialData?.toLat || undefined,
    toLon: initialData?.toLon || undefined,
    searchResults: initialData?.searchResults || [],
    search_id: initialData?.search_id || "",
    rate_key: initialData?.rate_key || "",
    confirmationId: initialData?.confirmationId || ""

  });
  const [touched, setTouched] = useState<TouchedFields>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Memoized validation
  const validation = useMemo(() => validateBookingForm(formData), [formData]);
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationResult = validateBookingForm(formData);
    if (validationResult.errors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationResult.errors[field] }));
    }
  };
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
      pickupLocaDescription: "",
      dropoffLocation: "",
      dropoffLocaDescription: "",
      pickupDate: "",
      pickupTime: "",
      selectedRide: "",
      priceRange: { min: 0, max: 0 },
      passengerCounts: { adults: 0, children: 0, infant: 0 },
      confirmationId:"",
      rate_key:"",
      search_id:""
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
    handleBlur,
    touched,
    setTouched
  };
};

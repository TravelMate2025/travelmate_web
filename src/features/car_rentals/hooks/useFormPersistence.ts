import { useCallback, useEffect, useRef } from 'react';
import { BookingFormData } from '../types/booking';

// Custom debounce function
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const useFormPersistence = (
  formData: BookingFormData,
  storageKey: string = 'carBookingForm'
) => {
  const debouncedSave = useRef(
    debounce((data: BookingFormData) => {
      try {
        // Only save meaningful data
        const dataToSave = {
          ...data,
          searchResults: [], // Don't persist search results
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Failed to save form data:', error);
      }
    }, 500)
  ).current;

  useEffect(() => {
    if (
      formData.pickupLocation ||
      formData.dropoffLocation ||
      formData.pickupLocaDescription ||
      formData.pickupDate
    ) {
      debouncedSave(formData);
    }
  }, [formData, debouncedSave]);

  const loadSavedData = useCallback((): Partial<BookingFormData> | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded from localStorage:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to load saved form data:', error);
      return null;
    }
  }, [storageKey]);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      console.log('Cleared localStorage');
    } catch (error) {
      console.error('Failed to clear saved form data:', error);
    }
  }, [storageKey]);

  return { loadSavedData, clearSavedData };
};
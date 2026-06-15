import { parse, format, isValid } from 'date-fns';
import { BookingFormData } from '../types/booking';
import axios from 'axios';
import instance from '../../../utils/axiosConfig';
import toast from 'react-hot-toast';
import {
  mockTransferBookingBySession,
  mockTransferBookingConfirmation,
  mockTransferCheckoutSession,
  mockTransferSearchResults,
  usePartnerMockData,
} from '../../shared/partnerMockData';

interface ApiErrorPayload {
    error?: string;
    detail?: string[];
    message?: string;
}

export interface TransferSearchParams {
    adults: string;
    children: string;
    infants: string;
    departing: string;
    fcode: string;
    ftype: string;
    tcode: string;
    ttype: string;
    language?: string;
    transfer_type?: string;
    min_price?: number;
    max_price?: number;
}

interface PostTransferSearchParams {
    pickup_location: string;
    dropoff_location: string;
    pickup_date: string;
    pickup_time: string;
    passengers: number;
    transfer_type?: string;
    end_address?: string;
    end_city?: string;
    end_country?: string;
    price_min?: number;
    price_max?: number;
}

interface BookingConfirmationParams {
    search_id: string;
    rate_key: string;
    first_name: string;
    last_name: string;
    dob: string;
    email: string;
    country_code: string;
    phone: string;
    remark?: string;

}

interface TransferResult {
    success: boolean;
    data?: {
        results: {
            services: unknown[];
            data: unknown[];
        };
        search_id: string;
    };
    fallback_info?: {
        attempts: number;
        locations_tried: string[];
        suggestions: string[];
    };
    error?: string;
    message?: string;

}

interface BookingConfirmationResult {
    success: boolean;
    data?: {
        id: string;
        status: string;
        total_price: string;
        booking_id: string;
        bookings: unknown[];
    };
    status?: number;
    error?: string;
}

interface CheckoutSessionResult {
    success: boolean;
    checkout_url?: string;
    error?: string;
}

interface BookingFinalizeResult {
    success: boolean;
    data?: unknown;
    error?: string;
}

interface LookupResult {
    success: boolean;
    data?: LookupLocation[];
    error?: string;
}

interface LookupLocation {
    cityName?: string;
    countryCode?: string;
    countryName?: string;
    displayName: string;
    geoCode?: { latitude: number; longitude: number };
    iataCode?: string;
    id?: string;
    name?: string;
    type?: string;
}

interface TransferSearchPayload {
    results?: {
        services?: unknown[];
        data?: unknown[];
    };
    search_id?: string;
    fallback_info?: {
        attempts?: number;
        locations_tried?: string[];
        suggestions?: string[];
    };
}

class TransferService {
    private baseUrl = import.meta.env.VITE_API_BASE_URL;
    private terminalCache: Map<string, LookupLocation[]> = new Map();

    private getErrorMessage(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const payload = error.response?.data as ApiErrorPayload | undefined;
            return payload?.error || (Array.isArray(payload?.detail) ? payload?.detail[0] : undefined) || payload?.message || error.message;
        }
        return error instanceof Error ? error.message : String(error);
    }


    async searchTransfers(params: TransferSearchParams): Promise<TransferResult> {
        if (usePartnerMockData) {
            return {
                success: true,
                data: {
                    results: {
                        services: mockTransferSearchResults(),
                        data: mockTransferSearchResults(),
                    },
                    search_id: 'mock-search-001',
                },
            };
        }

        try {
            const queryString = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryString.append(key, value.toString());
                }
            });


            const response = await axios.get<TransferSearchPayload>(`${this.baseUrl}/transfers/search-terminal-to-gps/?${queryString.toString()}`);
            return {
                success: true,
                data: {
                    results: {
                        services: response.data?.results?.services ?? [],
                        data: response.data?.results?.data ?? [],
                    },
                    search_id: response.data?.search_id ?? "",
                },
                fallback_info: response.data?.fallback_info
                    ? {
                        attempts: response.data.fallback_info.attempts ?? 0,
                        locations_tried: response.data.fallback_info.locations_tried ?? [],
                        suggestions: response.data.fallback_info.suggestions ?? [],
                    }
                    : undefined,
            };

        } catch (error: unknown) {
            console.error('Transfer search failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error) || 'Search failed',
            };
        }
    }


    async createBookingConfirmation(accessToken: string, params: BookingConfirmationParams): Promise<BookingConfirmationResult> {
        if (usePartnerMockData) {
            return {
                success: true,
                data: mockTransferBookingConfirmation(),
                status: 200,
            };
        }

        try {
            const response = await instance.post<BookingConfirmationResult['data']>(`${this.baseUrl}/transfers/booking/confirmation/`,
                JSON.stringify(params), {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            );
            return {
                success: true,
                data: response.data,
                status: response.status,
            };
        } catch (error: unknown) {
            console.error('Create booking confirmation failed:', error);
            toast.error(this.getErrorMessage(error) || 'Network Error');
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async createCheckoutSession(confirmationId: string): Promise<CheckoutSessionResult> {
        if (usePartnerMockData) {
            return mockTransferCheckoutSession();
        }

        try {

            const response = await instance.post<CheckoutSessionResult>(`${this.baseUrl}/transfers/booking/${confirmationId}/create-checkout-session/`);
            return {
                checkout_url: response?.data?.checkout_url,
                success: true,

            };

        } catch (error: unknown) {
            console.error('Create checkout session failed:', error);
            toast.error(this.getErrorMessage(error) || 'Checkout session failed');
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async cancelBooking(confirmationId: string): Promise<BookingFinalizeResult> {
        if (usePartnerMockData) {
            return {
                success: true,
                data: { confirmationId, status: 'cancelled' },
            };
        }

        try {
            const response = await axios.post(`${this.baseUrl}/transfers/booking/${confirmationId}/cancel/`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            console.error('Cancel booking failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }
    async finalizeBooking(confirmationId: string): Promise<BookingFinalizeResult> {
        if (usePartnerMockData) {
            return {
                success: true,
                data: { confirmationId, status: 'finalized' },
            };
        }

        try {
            const response = await instance.post(`${this.baseUrl}/transfers/booking/finalize/${confirmationId}/`);
            return {
                success: true,
                data: response.data


            }
        } catch (error: unknown) {
            console.error('Cancel booking failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async getBookingBySession(sessionId: string | null): Promise<BookingConfirmationResult> {
        if (usePartnerMockData) {
            return {
                success: true,
                data: mockTransferBookingBySession().data,
            };
        }

        try {
            const response = await instance.get(`${this.baseUrl}/transfers/booking/confirmation/by-session/?session_id=${sessionId}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            console.error('Get booking by session failed:', error);
            toast.error(this.getErrorMessage(error) || 'Failed to fetch booking');
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }


    async lookupTerminal(name: string): Promise<LookupResult> {
        if (usePartnerMockData) {
            const normalized = name.toLowerCase().trim();
            const data: LookupLocation[] = [
                {
                    cityName: 'Lagos',
                    countryCode: 'NG',
                    countryName: 'Nigeria',
                    displayName: 'Murtala Muhammed International Airport',
                    geoCode: { latitude: 6.577, longitude: 3.321 },
                    iataCode: 'LOS',
                    id: 'los',
                    name: 'Murtala Muhammed International Airport',
                    type: 'airport',
                },
                {
                    cityName: 'Abuja',
                    countryCode: 'NG',
                    countryName: 'Nigeria',
                    displayName: 'Nnamdi Azikiwe International Airport',
                    geoCode: { latitude: 9.006, longitude: 7.263 },
                    iataCode: 'ABV',
                    id: 'abv',
                    name: 'Nnamdi Azikiwe International Airport',
                    type: 'airport',
                },
            ].filter((item) => item.displayName.toLowerCase().includes(normalized));
            return {
                success: true,
                data,
            };
        }

        const cacheKey = name.toLowerCase().trim();
        if (this.terminalCache.has(cacheKey)) {
            return {
                success: true,
                data: this.terminalCache.get(cacheKey),
            };
        }

        try {
            const response = await axios.get<{ results?: LookupLocation[]; data?: LookupLocation[] }>(`${this.baseUrl}/flights/search/search_airports/?keyword=${encodeURIComponent(name)}`);
            const results = (response.data?.results || response.data?.data || response.data || []) as LookupLocation[];
            this.terminalCache.set(cacheKey, results);

            return {
                success: true,
                data: results,
            };

        } catch (error: unknown) {
            console.error('Terminal lookup failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }





    convertFormToApiParams(formData: BookingFormData): TransferSearchParams {

        if (!formData.pickupDate) {
            throw new Error('Departure date is required');
        }
        if (!formData.pickupTime) {
            throw new Error('Pickup time is required');
        }
        if (!formData.pickupLocation || !/^[A-Z]{3}$/.test(formData.pickupLocation)) {
            throw new Error('Invalid pickup location: Must be a 3-letter IATA code');
        }
        if (!formData.dropoffLocation) {
            throw new Error('Invalid dropoff location');
        }
        // if (!formData.toLat || !formData.toLon) {
        //     throw new Error('Dropoff location must have valid GPS coordinates');
        // }

        let transfer_type = "PRIVATE";
        if (formData.selectedRide === "Shared Ride") {
            transfer_type = "SHARED";
        } else if (formData.selectedRide === "Private and Shared Ride") {
            transfer_type = "PRIVATE,SHARED";
        }
        const { departing } = this.formatDateTime(formData.pickupDate, formData.pickupTime);

        return {
            adults: formData.passengerCounts.adults.toString(),
            children: formData.passengerCounts.children.toString(),
            infants: formData.passengerCounts.infant.toString(),
            departing,
            fcode: formData.pickupLocation,
            ftype: 'IATA',
            tcode: `${formData.toLat},${formData.toLon}`,
            ttype: 'GPS',
            language: 'en',
            transfer_type,
            min_price: formData.priceRange.min,
            max_price: formData.priceRange.max,

        };
    }

    convertFormToPostApiParams(formData: {
        from: string;
        to: string;
        departureDate: string;
        times: { pickUpTime: string };
        priceRange: { min: number; max: number };
        selectedRide: string;
        passengerCounts: { adults: number; children: number; infant: number };
        endAddress?: string;
        endCity?: string;
        endCountry?: string;
    }): PostTransferSearchParams {
        if (!formData.departureDate) {
            throw new Error('Departure date is required');
        }
        if (!formData.times?.pickUpTime) {
            throw new Error('Pickup time is required');
        }
        if (!formData.from || formData.from.length < 2) {
            throw new Error('Invalid pickup location');
        }
        if (!formData.to) {
            throw new Error('Invalid dropoff location');
        }
        if (new Date(formData.times?.pickUpTime).toISOString() < new Date().toISOString()) {
            throw new Error('Pickup time must be in the future');
        }

        const { departing } = this.formatDateTime(formData.departureDate, formData.times.pickUpTime);
        const pickupDateTime = new Date(departing);
        if (isNaN(pickupDateTime.getTime())) {
            throw new Error('Invalid pickup date/time');
        }
        if (pickupDateTime.getTime() <= Date.now()) {
            throw new Error('Pickup time must be in the future');
        }

        const pickup_location = formData.from
        const dropoff_location = formData.endCountry?.toUpperCase() || formData.to.split(',')[0].trim();

        let transfer_type = "PRIVATE";
        if (formData.selectedRide === "Shared Ride") {
            transfer_type = "SHARED";
        } else if (formData.selectedRide === "Private and Shared Ride") {
            transfer_type = "PRIVATE,SHARED";
        }
        return {
            pickup_location,
            dropoff_location,
            pickup_date: this.formatDate(formData.departureDate),
            pickup_time: this.formatTime(formData.times.pickUpTime),
            passengers: formData.passengerCounts.adults + formData.passengerCounts.children + formData.passengerCounts.infant,
            transfer_type,
            end_address: formData.endAddress,
            end_city: formData.endCity,
            end_country: formData.endCountry,
            price_min: formData.priceRange.min,
            price_max: formData.priceRange.max,
        };
    }


    private formatDateTime(dateStr: string, timeStr: string): { departing: string } {
        try {
            if (!dateStr || !timeStr) {
                throw new Error('Date or time string is undefined or empty');
            }

            let date: Date;

            // Handle ISO or standard yyyy-MM-dd input
            if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
                date = new Date(dateStr);
            } else {
                // Handle "06 Oct 2025" etc.
                const datePart = dateStr.includes(' - ') ? dateStr.split(' - ')[0] : dateStr;
                date = parse(datePart, 'dd MMM yyyy', new Date());
            }

            // Combine with time
            const [hours, minutes] = timeStr.split(':');
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

            if (!isValid(date)) throw new Error('Invalid parsed date');

            const formattedDateTime = format(date, "yyyy-MM-dd'T'HH:mm:ss");
            return { departing: formattedDateTime };

        } catch (error) {
            console.error('Date formatting error:', error);
            const fallback = new Date();
            fallback.setHours(fallback.getHours() + 1);
            const formattedFallback = format(fallback, "yyyy-MM-dd'T'HH:mm:ss");
            return { departing: formattedFallback };
        }
    }

    private formatDate(dateStr: string): string {
        try {
            if (!dateStr) {
                throw new Error('Date string is undefined or empty');
            }
            let date: Date;
            if (dateStr.includes('-')) {
                const singleDate = dateStr.split(' - ')[0];
                date = parse(singleDate, 'dd MMM yyyy', new Date());
            } else {
                date = parse(dateStr, 'dd MMM yyyy', new Date());
            }
            return format(date, 'yyyy-MM-dd');
        } catch (error) {
            console.error('Date formatting error:', error);
            const fallback = new Date();
            return format(fallback, 'yyyy-MM-dd');
        }
    }

    private formatTime(timeStr: string): string {
        try {
            if (!timeStr) {
                throw new Error('Time string is undefined or empty');
            }
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            return format(date, 'HH:mm');
        } catch (error) {
            console.error('Time formatting error:', error);
            const fallback = new Date();
            fallback.setHours(fallback.getHours() + 1);
            return format(fallback, 'HH:mm');
        }
    }

}

export const transferService = new TransferService();

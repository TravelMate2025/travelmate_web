import { parse, format, isValid } from 'date-fns';
import { BookingFormData, CarTransferOption, CatalogReviewsResponse } from '../types/booking';
import axios from 'axios';
import instance from '../../../utils/axiosConfig';
import toast from 'react-hot-toast';

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

interface TransferQuoteParams {
    listingType: string;
    listingId: string;
    cancellationOptionId?: string;
    currency?: string;
    pickupAt?: string;
}

interface TransferHoldTraveler {
    firstName: string;
    lastName: string;
    type: string;
    email: string;
}

interface TransferHoldParams {
    listingType: string;
    listingId: string;
    quoteLockId: string;
    guestCount: number;
    travelers: TransferHoldTraveler[];
    customerReference?: string;
    cancellationOptionId?: string;
    // Client-metadata-only fields — not forwarded to the partner, used by the
    // backend to populate the local TransferBooking record (the partner's
    // hold response doesn't echo listing details back). See
    // docs/BOOKING_API_CONTRACT.md §2.
    pickupLocationLabel?: string;
    destinationCity?: string;
    pickupAt?: string;
    rideType?: string;
    vehicleClass?: string;
    passengerCapacity?: number;
    luggageCapacity?: number;
    providerName?: string;
}

interface TransferPaymentIntentParams {
    quoteLockId: string;
    bookingReference: string;
    redirectUrl: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
}

interface TransferResult {
    success: boolean;
    data?: {
        results: {
            services: unknown[];
            data: unknown[];
            search?: unknown;
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

interface PaymentConfirmResult {
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
    transfers?: unknown[];
    results?: {
        services?: unknown[];
        data?: unknown[];
        search?: unknown;
    };
    search_id?: string;
    fallback_info?: {
        attempts?: number;
        locations_tried?: string[];
        suggestions?: string[];
    };
    search?: unknown;
}

class TransferService {
    private baseUrl = (instance.defaults.baseURL || "https://travelmate.com").replace(/\/$/, "");
    private terminalCache: Map<string, LookupLocation[]> = new Map();

    private getErrorMessage(error: unknown): string {
        if (axios.isAxiosError(error)) {
            const payload = error.response?.data as ApiErrorPayload | undefined;
            return payload?.error || (Array.isArray(payload?.detail) ? payload?.detail[0] : undefined) || payload?.message || error.message;
        }
        return error instanceof Error ? error.message : String(error);
    }


    async searchTransfers(params: TransferSearchParams): Promise<TransferResult> {
        try {
            const departingDateTime = new Date(params.departing);
            const pickupDate = isValid(departingDateTime) ? format(departingDateTime, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
            const pickupTime = isValid(departingDateTime) ? format(departingDateTime, 'HH:mm') : '10:00';
            const passengers = Number(params.adults || 0) + Number(params.children || 0) + Number(params.infants || 0);
            const payload = {
                pickup_location: params.fcode,
                pickup_location_type: params.ftype,
                dropoff_location: params.tcode,
                dropoff_location_type: params.ttype,
                pickup_date: pickupDate,
                pickup_time: pickupTime,
                passengers: passengers > 0 ? passengers : 1,
                q: [params.fcode, params.tcode].filter(Boolean).join(' '),
                vehicleClass: params.transfer_type,
                min_price: params.min_price,
                max_price: params.max_price,
                date: pickupDate,
            };

            const response = await instance.post<TransferSearchPayload>(`${this.baseUrl}/transfers/search/`, payload);
            const backendTransfers = response.data?.results?.services ?? response.data?.results?.data ?? response.data?.transfers ?? [];
            return {
                success: true,
                data: {
                    results: {
                        services: backendTransfers,
                        data: backendTransfers,
                        search: response.data?.results?.search,
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


    async getTransferDetail(transferId: string): Promise<{ success: boolean; data?: CarTransferOption; error?: string }> {
        try {
            const response = await instance.get<CarTransferOption>(`${this.baseUrl}/transfers/${transferId}/`);
            return { success: true, data: response.data };
        } catch (error: unknown) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    async getTransferReviews(transferId: string): Promise<{ success: boolean; data?: CatalogReviewsResponse; error?: string }> {
        try {
            const response = await instance.get(
                `${this.baseUrl}/v1/public/catalog/transfers/${transferId}/reviews`,
                { params: { page: 1, pageSize: 20 } },
            );
            const data = (response.data?.data ?? response.data) as CatalogReviewsResponse;
            return { success: true, data };
        } catch (error: unknown) {
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    async createTransferQuote(params: TransferQuoteParams): Promise<BookingFinalizeResult> {
        try {
            const response = await instance.post(`${this.baseUrl}/transfers/booking/quote/`, params);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async createTransferHold(params: TransferHoldParams): Promise<BookingFinalizeResult> {
        try {
            const response = await instance.post(`${this.baseUrl}/transfers/booking/holds/`, params);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async createTransferPaymentIntent(params: TransferPaymentIntentParams): Promise<BookingFinalizeResult> {
        try {
            const response = await instance.post(`${this.baseUrl}/transfers/payments/intents/`, params);
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }

    async createCheckoutSession(confirmationId: string): Promise<CheckoutSessionResult> {
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
        try {
            const response = await instance.post(`${this.baseUrl}/transfers/booking/${confirmationId}/cancel/`);
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

    async getBookingBySession(sessionId: string | null): Promise<BookingFinalizeResult> {
        try {
            const response = await instance.get(`${this.baseUrl}/transfers/booking/confirmation/by-session/?payment_intent_id=${sessionId}`);
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

    async confirmPaymentIntent(paymentIntentId: string): Promise<PaymentConfirmResult> {
        try {
            const response = await instance.post(
                `${this.baseUrl}/v1/public/payments/intents/${paymentIntentId}/confirm`,
                {},
                { headers: { 'Idempotency-Key': `transfer-confirm-${paymentIntentId}` } },
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: unknown) {
            console.error('Confirm payment intent failed:', error);
            return {
                success: false,
                error: this.getErrorMessage(error),
            };
        }
    }


    async lookupTerminal(name: string): Promise<LookupResult> {
        const cacheKey = name.toLowerCase().trim();
        if (this.terminalCache.has(cacheKey)) {
            return {
                success: true,
                data: this.terminalCache.get(cacheKey),
            };
        }

        try {
            const response = await instance.get<{ results?: LookupLocation[]; data?: LookupLocation[] }>(
                `${this.baseUrl}/transfers/lookup/terminal/?name=${encodeURIComponent(name)}`
            );
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
        if (!formData.pickupLocation) {
            throw new Error('Invalid pickup location');
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

        const hasGps = formData.toLat != null && formData.toLon != null
            && formData.toLat !== 0 && formData.toLon !== 0;

        // Partner catalog pickups use area/city codes, not IATA. Use IATA only when
        // the code looks like a real IATA code (2-3 uppercase letters).
        const isIata = /^[A-Z]{2,3}$/.test(formData.pickupLocation);

        return {
            adults: formData.passengerCounts.adults.toString(),
            children: formData.passengerCounts.children.toString(),
            infants: formData.passengerCounts.infant.toString(),
            departing,
            fcode: formData.pickupLocation,
            ftype: isIata ? 'IATA' : 'CITY',
            tcode: hasGps ? `${formData.toLat},${formData.toLon}` : (formData.dropoffLocation || formData.dropoffLocaDescription),
            ttype: hasGps ? 'GPS' : 'CITY',
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

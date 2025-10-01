import { parse, format } from 'date-fns';
import { BookingFormData } from '../types/booking';
import axios from 'axios';
import instance from '../../../utils/axiosConfig';
import toast from 'react-hot-toast';

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
    data?: any[];
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
        bookings: any[]
    };
    error?: string;
}

interface CheckoutSessionResult {
    success: boolean;
    checkout_url?: string;
    error?: string;
}

interface BookingFinalizeResult {
    success: boolean;
    data?: any;
    error?: string;
}

interface LookupResult {
    success: boolean;
    data?: any[];
    error?: string;
}

class TransferService {
    private baseUrl = 'https://travelmate-backend-0suw.onrender.com/api';

    async searchTransfers(params: TransferSearchParams): Promise<TransferResult> {
        try {
            const queryString = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryString.append(key, value.toString());
                }
            });


            const response = await axios.get(`${this.baseUrl}/transfers/search-terminal-to-gps/?${queryString.toString()}`);
            console.log('Transfer search response:', response.data);
            return {
                success: true,
                data: response?.data || [],
                fallback_info: response?.data?.fallback_info,
            };

        } catch (error) {
            console.error('Transfer search failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Search failed',
            };
        }
    }


    async createBookingConfirmation(accessToken: string, params: BookingConfirmationParams): Promise<BookingConfirmationResult> {
        try {
            const response = await instance.post(`${this.baseUrl}/transfers/booking/confirmation/`,
                JSON.stringify(params), {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            );
            return {
                success: true,
                data: response.data,
            };
        } catch (error: any) {
            console.error('Create booking confirmation failed:', error);
            toast.error(error?.response?.data?.error || 'Booking failed. Please try again.')
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create booking confirmation',
            };
        }
    }

    async createCheckoutSession(confirmationId: string): Promise<CheckoutSessionResult> {
        try {

            const response = await instance.post(`${this.baseUrl}/transfers/booking/${confirmationId}/create-checkout-session/`,);
            return {
                checkout_url: response?.data?.checkout_url,
                success: true,

            };

        } catch (error: any) {
            console.error('Create checkout session failed:', error);
            toast.error(error.response.data.detail)

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create checkout session',
            };
        }
    }

    async cancelBooking(confirmationId: string): Promise<BookingFinalizeResult> {
        try {
            const response = await axios.get(`${this.baseUrl}/transfers/booking/${confirmationId}/cancel/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Cancel booking failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to cancel booking',
            };
        }
    }

    async getBookingBySession(sessionId: string): Promise<BookingConfirmationResult> {
        try {
            const response = await instance.get(`${this.baseUrl}/transfers/booking/confirmation/by-session/?session_id=${sessionId}`);
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('Get booking by session failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to instance.get booking details',
            };
        }
    }
    async lookupTerminal(name: string): Promise<LookupResult> {
        try {
            const response = await axios.get(`${this.baseUrl}/flights/search/search_airports/?keyword=${encodeURIComponent(name)}`);

            return {
                success: true,
                data: response.data?.results || response.data?.data || response.data || [],
            };


        } catch (error) {
            console.error('Terminal lookup failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to lookup terminal',
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
            const datePart = dateStr.includes(' - ') ? dateStr.split(' - ')[0] : dateStr;
            const date = parse(datePart, 'dd MMM yyyy', new Date());
            const [hours, minutes] = timeStr.split(':');
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Sets seconds to 00
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

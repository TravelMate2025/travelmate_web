import axios from 'axios';

// Function to format dates as YYYY-MM-DD
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface SearchFilters {
    min_price?: number;
    max_price?: number;
    amenities?: string[];
}

export const searchHotels = async (
    destination: string,
    checkIn: string,
    checkOut: string,
    adults: number,
    children: number,
    filters?: SearchFilters
) => {
    try {
        const checkInFormatted = formatDate(checkIn);
        const checkOutFormatted = formatDate(checkOut);

        const params = {
            destination,
            check_in: checkInFormatted,
            check_out: checkOutFormatted,
            adults,
            children,
            min_price: filters?.min_price,
            max_price: filters?.max_price,
            amenities: filters?.amenities ? filters.amenities.join(',') : undefined,
        };

        // Filter out undefined values from params
        const cleanedParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined)
        );

        const response = await axios.get('http://127.0.0.1:8000/api/stay/hotels/search/', {
            params: cleanedParams,
        });
        
        // Log the successful API response
        console.log("API Response Data:", response.data); 
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching hotels:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Failed to fetch hotel data.');
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};
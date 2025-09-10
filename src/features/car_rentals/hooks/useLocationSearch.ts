import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import instance from '../../../utils/axiosConfig';


export const useLocationSearch = () => {
    const [locations, setLocations] = useState<string[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) return;

            setSearchLoading(true);
            setSearchError(null);

            try {
                const response = await instance.get(`/api/transfers/lookup/terminal/?q=${encodeURIComponent(query)}`);
                setLocations(response.data || []);
            } catch (error) {
                setSearchError(error instanceof Error ? error.message : 'Search failed');
                setLocations([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300),
        []
    );

    const removeLocation = useCallback((locationToRemove: string) => {
        setLocations(prev => prev.filter(location => location !== locationToRemove));
    }, []);

    return {
        locations,
        searchLoading,
        searchError,
        searchLocations: debouncedSearch,
        removeLocation,
    };
};

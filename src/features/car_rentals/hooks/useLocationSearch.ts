import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { fetchRecentSearches } from '../services/recentSearch';
import axios from 'axios';
import { RootState } from '../../../store';
import { useSelector } from "react-redux";


export const useLocationSearch = () => {
    const [locations, setLocations] = useState<string[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const { accessToken } = useSelector((state: RootState) => state.auth);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (!query.trim()) return;

            setSearchLoading(true);
            setSearchError(null);

            try {
                const response = await axios.get(`/api/transfers/lookup/terminal/?q=${encodeURIComponent(query)}`);
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

    // Load recent searches
    useEffect(() => {
        const loadRecentSearches = async () => {
            try {
                setSearchLoading(true);
                await fetchRecentSearches(setLocations, accessToken);
            } catch (error) {
                console.error('Failed to load recent searches:', error);
                setSearchError('Failed to load recent searches');
            } finally {
                setSearchLoading(false);
            }
        };

        loadRecentSearches();
    }, []);

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

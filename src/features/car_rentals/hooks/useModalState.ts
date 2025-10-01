import { useState, useCallback } from "react";
export const useModalState = () => {
    const [modals, setModals] = useState({
        passengers: false,
        rideType: false,
        priceRange: false,
        priceError: false,
        searchDropLocation: false,
        searchPickLocation: false
    });

    const openModal = useCallback((modalName: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modalName]: true }));
    }, []);

    const closeModal = useCallback((modalName: keyof typeof modals) => {
        setModals(prev => ({ ...prev, [modalName]: false }));
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            passengers: false,
            rideType: false,
            priceRange: false,
            priceError: false,
            searchDropLocation: false,
            searchPickLocation: false
        });
    }, []);

    return {
        modals,
        openModal,
        closeModal,
        closeAllModals,

    };
};
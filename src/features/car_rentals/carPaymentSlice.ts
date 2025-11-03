import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CarInfo {
    // Form fields that match the booking form structure
    pickupLocation: string;
    pickupLocaDescription: string
    dropoffLocation: string;
    dropoffLocaDescription: string;
    pickupDate: string;
    pickupTime: string;
    selectedRide: string;
    priceRange: {
        min: number;
        max: number;
    };
    passengerCounts: {
        adults: number;
        children: number;
        infant: number;
    };
    toLat?: number,
    toLon?: number

    searchResults: any[];
}

interface CardInfo {
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
    agreement: boolean;
}

interface PersonalDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}

interface FormState {
    cardinfo: CardInfo | null;
    personalDetails: PersonalDetails | null;
    carInfo: CarInfo | null;
}
const initialCarInfo: CarInfo = {
    pickupLocation: "",
    pickupLocaDescription: "",
    dropoffLocation: "",
    dropoffLocaDescription: "",
    pickupDate: "",
    pickupTime: "",
    selectedRide: "",
    priceRange: { min: 0, max: 0 },
    passengerCounts: { adults: 0, children: 0, infant: 0 },
    searchResults: [],
    toLat: undefined,
    toLon: undefined,
};
const initialState: FormState = {
    cardinfo: null,
    personalDetails: null,
    carInfo: initialCarInfo,
};

const carPaymentSlice = createSlice({
    name: "carPayment",
    initialState,
    reducers: {
        setCardInfo: (state, action: PayloadAction<CardInfo>) => {
            state.cardinfo = action.payload;
        },
        setPersonalDetails: (state, action: PayloadAction<PersonalDetails>) => {
            state.personalDetails = action.payload;
        },
        setCarInfo: (state, action: PayloadAction<CarInfo>) => {
            state.carInfo = action.payload;
        },
        setSearchResults: (state, action: PayloadAction<any[]>) => {
            if (state.carInfo) {
                state.carInfo.searchResults = action.payload;
            }
        },
        // Add helper action to update specific car info fields
        updateCarInfoField: (state, action: PayloadAction<{ field: keyof CarInfo, value: any }>) => {
            if (state.carInfo) {
                (state.carInfo as any)[action.payload.field] = action.payload.value;
            }
        },
        resetForm: () => initialState,
    },
});

export const {
    setCardInfo,
    setPersonalDetails,
    setCarInfo,
    setSearchResults,
    updateCarInfoField,
    resetForm
} = carPaymentSlice.actions;

export default carPaymentSlice.reducer;
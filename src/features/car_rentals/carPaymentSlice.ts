import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    phoneNumber: string;
    dateOfBirth: string;
}

interface LocationOption {
    label: string;
    value: string;
}

interface TimeInfo {
    pickUpTime: string;
}

interface PassengerCounts {
    adults: number;
    children: number;
    infant: number;
}

interface CarInfo {
    from: LocationOption | null;
    to: LocationOption | null;
    departureDate: string | null;
    times: TimeInfo;
    priceRange: string;
    selectedRide: string | null;
    passengerCounts: PassengerCounts;
    searchResults: any[];
}


interface FormState {
    cardinfo: CardInfo | null;
    personalDetails: PersonalDetails | null;
    carInfo: CarInfo | null;
}

const initialState: FormState = {
    cardinfo: null,
    personalDetails: null,
    carInfo: null,
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
        resetForm: () => initialState,
    },
});

export const { setCardInfo, setPersonalDetails, setCarInfo, setSearchResults, resetForm } =
    carPaymentSlice.actions;

export default carPaymentSlice.reducer;

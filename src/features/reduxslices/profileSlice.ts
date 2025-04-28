import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  mobile_number: string | null;
}

interface ProfileState {
  profile: UserProfile | null;
}

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setUserProfile, clearUserProfile } = profileSlice.actions;
export default profileSlice.reducer;

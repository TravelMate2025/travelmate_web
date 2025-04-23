import { store } from '../store';
import { RootState } from '../store';

export const getAccessToken = (): string | null => {
    const state: RootState = store.getState();
    return state.auth.accessToken;
};
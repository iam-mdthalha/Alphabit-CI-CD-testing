import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StateEventsState {
    isLoggedIn: boolean;
}

const initialState: StateEventsState = {
    isLoggedIn: false,
}

const StateEvents = createSlice({
    name: "stateevents",
    initialState,
    reducers: {
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        }
    }
});

export const { setLoggedIn } = StateEvents.actions;

export default StateEvents.reducer;
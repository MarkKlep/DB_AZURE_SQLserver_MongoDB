import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userProfile: "",
        tickets: []
    },
    reducers: {
        rememberUser: (state, action) => {
            state.userProfile = action.payload;
        },
        rememberTickets: (state, action) => {
             state.tickets.push(action.payload);
        },
        removeTicket: (state, action) => {
            state.tickets =  state.tickets.filter(ticket => ticket !== action.payload);
       }
    }
});

export const { rememberUser, rememberTickets, removeTicket } = userSlice.actions;
export default userSlice.reducer;
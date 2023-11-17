import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminLogin: "admin123!",
        adminPassword: "kyky",
        adminEnter: false
    },
    reducers: {
        checkAdminData: (state, action) => {
            if(state.adminLogin === action.payload.adminLogin &&
            state.adminPassword === action.payload.adminPassword) {
                state.adminEnter = true;
            }
        },
        exitAdmin: (state) => {
            state.adminEnter = false;
        }
    }
});

export const { checkAdminData, exitAdmin } = adminSlice.actions;
export default adminSlice.reducer;
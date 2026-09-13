import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        updateAvatar: (state, action) => {
            state.user.avatar.url = action.payload
        },

    },
});

export const { login, logout, setLoading, updateAvatar } = authSlice.actions;

export default authSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice.js'
import todoSlice from '../features/todoSlice.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        todo:todoSlice
    }
});

export default store;
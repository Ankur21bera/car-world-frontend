import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ownerReducer from './ownerSlice';
import bookingReducer from './bookingSlice'

export const store = configureStore({
    reducer:{
        user:userReducer,
        owner:ownerReducer,
        booking:bookingReducer
    }
})


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = "https://car-world-backend.vercel.app/api/bookings";

const initialState = {
  availableCars: [],
  userBookings: [],
  ownerBookings: [],
  bookingDetails: null,
  razorpayOrder: null,
  loading: false,
  success: false,
  message: "",
  error: null,
};

export const checkAvailabilityOfCar = createAsyncThunk(
  "booking/checkAvailabilityOfCar",
  async (formData, thunkAPI) => {
    try {

      const { data } = await axios.post(
        `${backendUrl}/check-availability`,
        formData
      );

      return data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (formData, thunkAPI) => {
    try {

      const token = sessionStorage.getItem("token");

      const { data } = await axios.post(
        `${backendUrl}/create-booking`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      return data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (_, thunkAPI) => {
    try {

      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `${backendUrl}/user-bookings`,
        {
          headers: {
            token,
          },
        }
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);


export const getOwnerBookings = createAsyncThunk(
  "booking/getOwnerBookings",
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `${backendUrl}/owner-bookings`,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);

export const changeBookingStatus = createAsyncThunk(
  "booking/changeBookingStatus",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(
        `${backendUrl}/change-status`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);


export const getBookingDetails = createAsyncThunk(
  "booking/getBookingDetails",
  async (bookingId, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.get(
        `${backendUrl}/details/${bookingId}`,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );
    }
  }
);


export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(
        `${backendUrl}/cancel-booking`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);


export const requestOfflinePayment = createAsyncThunk(
  "booking/requestOfflinePayment",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(
        `${backendUrl}/request-offline-payment`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);



export const approveOfflinePayment = createAsyncThunk(
  "booking/approveOfflinePayment",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.put(
        `${backendUrl}/approve-offline-payment`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  "booking/createRazorpayOrder",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/create-razorpay-order`,
        formData,
        {
          headers: {
            token,
          },
        }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );
    }
  }
);


export const verifyRazorpayPayment = createAsyncThunk(
  "booking/verifyRazorpayPayment",
  async (formData, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/verify-razorpay-payment`,
        formData,
        {
          headers: {
            token,
          },
        }
      );

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        }
      );

    }
  }
);






const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingMessage: (state) => {
      state.message = "";
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(checkAvailabilityOfCar.pending, (state) => {
      state.loading = true;
    })
    .addCase(checkAvailabilityOfCar.fulfilled, (state, action) => {
      state.loading = false;
      state.availableCars =
      action.payload.availableCars;
    })
    .addCase(checkAvailabilityOfCar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(createBooking.pending, (state) => {
      state.loading = true;
    })
    .addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      state.userBookings.unshift(
        action.payload.booking
      );
    })
    .addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(getUserBookings.pending, (state) => {
      state.loading = true;
    })
    .addCase(getUserBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.userBookings =
      action.payload.bookings;
    })
    .addCase(getUserBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(getOwnerBookings.pending, (state) => {
      state.loading = true;
    })
    .addCase(getOwnerBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.ownerBookings =
        action.payload.bookings;
    })
    .addCase(getOwnerBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(changeBookingStatus.pending, (state) => {
      state.loading = true;
    })
    .addCase(changeBookingStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      state.ownerBookings = state.ownerBookings.map(
        (booking) =>
          booking._id === action.payload.booking._id
            ? action.payload.booking
            : booking
      );
    })
    .addCase(changeBookingStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(getBookingDetails.pending, (state) => {
      state.loading = true;
    })
    .addCase(getBookingDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.bookingDetails =
      action.payload.booking;
    })
    .addCase(getBookingDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(cancelBooking.pending, (state) => {
      state.loading = true;
    })
    .addCase(cancelBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    })
    .addCase(cancelBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(requestOfflinePayment.pending, (state) => {
      state.loading = true;
    })
    .addCase(requestOfflinePayment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    })
    .addCase(requestOfflinePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })




    // ================= APPROVE OFFLINE PAYMENT =================

    .addCase(approveOfflinePayment.pending, (state) => {
      state.loading = true;
    })

    .addCase(approveOfflinePayment.fulfilled, (state, action) => {

      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;

    })

    .addCase(approveOfflinePayment.rejected, (state, action) => {

      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(createRazorpayOrder.pending, (state) => {
      state.loading = true;
    })
    .addCase(createRazorpayOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.razorpayOrder = action.payload.order;
    })
    .addCase(createRazorpayOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    })
    .addCase(verifyRazorpayPayment.pending, (state) => {
      state.loading = true;
    })
    .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    })
    .addCase(verifyRazorpayPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message;
    });
  },
});

export const {clearBookingMessage} = bookingSlice.actions;

export default bookingSlice.reducer;
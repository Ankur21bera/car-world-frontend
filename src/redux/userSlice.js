import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = "https://car-world-backend.vercel.app/api/user";

const initialState = {
  user: null,
  token: sessionStorage.getItem("token") || "",
  loading: false,
  success: false,
  error: null,
  message: "",
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/register`,
        formData
      );

      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }

      sessionStorage.setItem("token", data.token);

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

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post(`${backendUrl}/login`, formData);
      if (!data.success) {
        return thunkAPI.rejectWithValue({
          message: data.message,
        });
      }
      sessionStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");

      const { data } = await axios.get(`${backendUrl}/data`, {
        headers: {
          token,
        },
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const { data } = await axios.post(`${backendUrl}/forgot-password`, {
        email,
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${backendUrl}/verify-otp`, {
        email,
        otp,
      });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (email, thunkAPI) => {
    try {
      const { data } = await axios.post(`${backendUrl}/resend-otp`, { email });
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/reset-password`,
        formData,
      );
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: "Something Went Wrong",
        },
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = "";
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";

      sessionStorage.removeItem("token");
    },

    clearMessage: (state) => {
      state.error = null;
      state.message = "";
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
        state.message = action.payload?.message;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // GET USER DATA
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // RESEND OTP
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { logoutUser, clearMessage } = userSlice.actions;

export default userSlice.reducer;

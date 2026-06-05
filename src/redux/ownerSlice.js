import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
const backendUrl = "https://car-world-backend.vercel.app/api/owner"

const initialState = {
    cars:[],
    publicCars:[],
    dashboardData:null,
    users:[],
    loading:false,
    success:false,
    message:"",
    error:null
}

export const changeRoleToOwner = createAsyncThunk(
  "owner/changeRoleToOwner",
  async (_, thunkAPI) => {
    try {
      const token = sessionStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/change-role`,
        {},
        {
          headers: { token },
        }
      );
      if (!data.success) {
        return thunkAPI.rejectWithValue(data);
      }
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

export const getPublicCars = createAsyncThunk(
    "owner/getPublicCars",
    async(_,thunkAPI)=>{
        try {
            const {data} = await axios.get(`${backendUrl}/public-cars`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"something went wrong"})
        }
    }
)

export const addCar = createAsyncThunk(
    "owner/addCar",
    async(formData,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.post(`${backendUrl}/add-cars`,formData,{headers:{token,"Content-Type":"multipart/form-data"}});
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data|| {message:"Something Went Wrong"})
        }
    }
)

export const getOwnerCars = createAsyncThunk(
    "owner/getOwnerCars",
    async(_,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.get(`${backendUrl}/owner-cars`,{headers:{token}});
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const  deleteCar = createAsyncThunk(
    "owner/deleteCar",
    async(carId,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.delete(`${backendUrl}/delete/${carId}`,{headers:{token}});
            return {...data,carId}
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const updateCar = createAsyncThunk(
    "owner/updateCar",
    async({carId,formData},thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.put(`${backendUrl}/update/${carId}`,formData,{headers:{token,"Content-Type":"multipart/form-data"}});
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const toggleCarAvailability = createAsyncThunk(
    "owner/toggleCarAvailability",
    async(carId,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.put(`${backendUrl}/toggle/${carId}`,{},{headers:{token}});
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const getDashboardData = createAsyncThunk(
    "owner/getDashboardData",
    async(_,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.get(`${backendUrl}/dashboard`,{headers:{token}});
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "owner/getAllUsers",
    async(_,thunkAPI)=>{
        try {
            const token = sessionStorage.getItem("token");
            const {data} = await axios.get(`${backendUrl}/all-users`,{headers:{token}})
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
        }
    }
)

export const updateUserImage = createAsyncThunk("owner/updateUserImage",async(formData,thunkAPI)=>{
    try {
        const token = sessionStorage.getItem("token");
        const {data} = await axios.post(`${backendUrl}/update-image`,formData,{headers:{token,"Content-Type":"multipart/form-data"}});
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || {message:"Something Went Wrong"})
    }
})

const ownerSlice = createSlice({
    name:"owner",
    initialState,
    reducers:{
        clearOwnerMessage:(state)=>{
            state.message = "";
            state.error = null;
            state.success = false;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(changeRoleToOwner.pending,(state)=>{
            state.loading = true;
        })
        .addCase(changeRoleToOwner.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        })
        .addCase(changeRoleToOwner.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(getPublicCars.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getPublicCars.fulfilled,(state,action)=>{
            state.loading = false;
            state.publicCars = action.payload.cars;
        })
        .addCase(getPublicCars.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message;
        })

        .addCase(addCar.pending,(state)=>{
            state.loading = true;
        })
        .addCase(addCar.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.cars.unshift(action.payload.car);
        })
        .addCase(addCar.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(getOwnerCars.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getOwnerCars.fulfilled,(state,action)=>{
            state.loading = false;
            state.cars = action.payload.cars;
        })
        .addCase(getOwnerCars.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(deleteCar.pending,(state)=>{
            state.loading = true;
        })
        .addCase(deleteCar.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.cars = state.cars.filter((car)=>car._id !== action.payload.carId);
        })
        .addCase(deleteCar.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(updateCar.pending,(state)=>{
            state.loading = true;
        })
        .addCase(updateCar.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.cars = state.cars.map((car)=>car._id ===action.payload.car._id?action.payload.car:car)
        })
        .addCase(updateCar.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(toggleCarAvailability.pending,(state)=>{
            state.loading = true;
        })
        .addCase(toggleCarAvailability.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
            state.cars = state.cars.map((car)=>car._id === action.payload.car._id?action.payload.car:car)
        })
        .addCase(toggleCarAvailability.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(getDashboardData.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getDashboardData.fulfilled,(state,action)=>{
            state.loading = false;
            state.dashboardData = action.payload.dashboardData;
        })
        .addCase(getDashboardData.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(getAllUsers.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.loading = false;
            state.users = action.payload.users;
        })
        .addCase(getAllUsers.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })

        .addCase(updateUserImage.pending,(state)=>{
            state.loading = true;
        })
        .addCase(updateUserImage.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = action.payload.success;
            state.message = action.payload.message;
        })
        .addCase(updateUserImage.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message
        })
    }
})

export const {clearOwnerMessage} = ownerSlice.actions;
export default ownerSlice.reducer;
// src/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

const initialState = {
  token: token || null,
  role: role || null,
  loading: false,
  error: null,
};


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, isAdmin }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      console.log('sdfsdsfd',response)
      localStorage.setItem('token', response.data?.token);
      localStorage.setItem('role', response.data?.role);
      return { token: response.data.token, role: response.data.role };
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { name, email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      return { token: response.data.token, role: response.data.role };
    } catch (err) {
      return rejectWithValue(err.response.data.error || 'An error occurred during signup');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },

  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // **Handle signup**
       .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

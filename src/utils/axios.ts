// src/utils/axios.js
import { logout } from '@/store/slices/authSlice';
import store from '@/store/store';
import axios from 'axios';



const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor remains the same

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { dispatch } = store;
    if (error.response && error.response.status === 401) {
      dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

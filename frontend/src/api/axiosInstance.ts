import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const axiosInstance = (token: string | null) => axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;

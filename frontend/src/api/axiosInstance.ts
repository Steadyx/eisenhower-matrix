import axios from "axios";
const enviornment = process.env.NODE_ENV || 'development';

const isProduction = enviornment === 'production';

const axiosInstance = (token: string | null) => axios.create({
  baseURL: isProduction ? 'https://eisenhower.edward-codes.com/api' : 'http://localhost:4000',
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;

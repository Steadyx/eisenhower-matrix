import axios from "axios";

const axiosInstance = (token: string | null) => axios.create({
  baseURL: "http://localhost:4000",
  headers: { Authorization: `Bearer ${token}` },
});

export default axiosInstance;

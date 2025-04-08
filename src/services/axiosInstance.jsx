import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7100", // Your .NET 8 API URL
    headers: { "Content-Type": "application/json" }
});

export default axiosInstance;

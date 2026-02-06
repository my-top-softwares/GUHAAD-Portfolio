import axios from "axios";

const API = axios.create({
    baseURL: "https://guhaad.onrender.com/api",
});

// Add a request interceptor to include the JWT token in the header
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

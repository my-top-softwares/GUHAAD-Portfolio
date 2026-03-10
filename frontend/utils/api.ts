import axios from "axios";

const API = axios.create({
    baseURL: "/api",
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use((config) => {
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem("userInfo") : null;
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

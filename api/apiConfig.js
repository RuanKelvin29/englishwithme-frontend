import axios from "axios";

const URLServer = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: URLServer,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default API;
export { URLServer };
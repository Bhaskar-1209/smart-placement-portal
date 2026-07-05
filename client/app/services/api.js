import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:7070/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("spp_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

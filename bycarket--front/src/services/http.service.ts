import axios from "axios";
import { getAuthToken } from "./storage.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const http = axios.create({
  baseURL: API_BASE_URL,
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => searchParams.append(key, val));
      } else {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  },
});

http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;

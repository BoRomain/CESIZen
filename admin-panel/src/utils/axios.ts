import axiosClient, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

const config: CreateAxiosDefaults = {
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const axios: AxiosInstance = axiosClient.create(config);

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;

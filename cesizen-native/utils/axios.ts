import axiosClient from "axios";
import * as SecureStore from "expo-secure-store";

const axios = axiosClient.create({
  baseURL: "http://10.176.138.14:3000",
});

axios.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;

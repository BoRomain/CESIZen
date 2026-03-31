import axiosClient, {
  type AxiosError,
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";

const accessToken = localStorage.getItem("accessToken");

const config: CreateAxiosDefaults = {
  baseURL: "http://localhost:3000",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
};

const axios: AxiosInstance = axiosClient.create(config);
let refreshPromise: Promise<string> | null = null;

type RetriableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as RetriableRequest | undefined;
    const status = axiosError.response?.status;
    const isRefreshRequest = originalRequest?.url?.includes("/utilisateur/refresh");

    if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(config.baseURL + "/utilisateur/refresh", {}, { withCredentials: true })
            .then((res) => {
              const { accessToken } = res.data;
              localStorage.setItem("accessToken", accessToken);
              return accessToken as string;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axios;

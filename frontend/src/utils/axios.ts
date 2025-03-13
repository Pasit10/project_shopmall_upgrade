import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_HOST = import.meta.env.VITE_API_HOST;

const axiosInstance = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);


let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axiosInstance.get("/token/refresh", { withCredentials: true })
          .then((res) => {
            isRefreshing = false;
            refreshPromise = null;
            return res;
          })
          .catch((refreshError) => {
            isRefreshing = false;
            refreshPromise = null;
            window.location.href = "/login"; // Redirect to login if refresh fails
            return Promise.reject(refreshError);
          });
      }

      try {
        await refreshPromise;
        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        return Promise.reject(refreshError); // Reject if refresh fails
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

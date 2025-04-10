import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_HOST = import.meta.env.VITE_API_HOST;

const axiosInstance = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (request) => request,
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    console.error("Axios error:", error.response);

    if (error.response?.status === 401 && !originalRequest._retry) {
      const skipRetryEndpoints = ["/login", "/google/login", "/register"];
      const requestUrl = new URL(originalRequest.url!, window.location.origin).pathname;

      if (skipRetryEndpoints.includes(requestUrl)) {
        return Promise.reject(error); // Don't retry for auth-related endpoints
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .get(`${API_HOST}/token/refresh`, { withCredentials: true })
          .then(() => {
            isRefreshing = false;
            refreshPromise = null;
          })
          .catch((refreshError) => {
            isRefreshing = false;
            refreshPromise = null;
            console.error("Token refresh failed:", refreshError);
            throw refreshError;
          });
      }

      try {
        await refreshPromise;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Error after token refresh attempt:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

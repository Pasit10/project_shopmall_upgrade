import axios from "axios";

const API_HOST = import.meta.env.VITE_API_HOST;

const axiosInstance = axios.create({
  baseURL: API_HOST,
  timeout: 1000,
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // if (originalRequest.url === "/auth/callback/google")
    //   return Promise.reject(error);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // ขอ access token ใหม่จาก backend
        await axiosInstance.get('/token/refresh', { withCredentials: true });

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export default axiosInstance;

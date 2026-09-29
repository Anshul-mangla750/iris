import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor to format errors uniformly
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Backend returned an error response
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        (error.response.status === 401
          ? 'Invalid email or password.'
          : error.response.status === 403
          ? 'You do not have permission to access this portal.'
          : error.response.status >= 500
          ? 'Server is temporarily unavailable. Please try again later.'
          : `Request failed (${error.response.status}).`);
    } else if (error.request) {
      // Network failure or backend server unreachable
      errorMessage = 'Unable to connect to the server. Please check your internet connection.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;

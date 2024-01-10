import axios from "axios";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          'http://localhost:8000/api/auth/token/refresh/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        );

        const { access: newAccess } = response.data;

        // Update tokens in localStorage and axios defaults
        localStorage.setItem('access_token', newAccess);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Handle the failure appropriately (e.g., logout user, redirect to login)
        // Example: window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Continue with the original error if not a 401 or already retried
    return Promise.reject(error);
  }
);

export default axios;

import axios from "axios";

let isRefreshing = false;
let failedRequests = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response: { status } = {} } = error;

    if (status === 401 && !isRefreshing) {
      try {
        isRefreshing = true;
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          'http://localhost:8000/token/refresh/',
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        axios.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data['access']}`;
        localStorage.setItem('access_token', refreshResponse.data.access);
        localStorage.setItem('refresh_token', refreshResponse.data.refresh);

        // Retry the original request after refreshing the token
        return axios(config);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login or handle the failure appropriately
        // Example: window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;

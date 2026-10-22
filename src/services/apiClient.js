import axios from 'axios';

// Shared Axios client: attach the saved access token to protected API calls.
const apiClient = axios.create({ baseURL: 'https://dummyjson.com', headers: { Accept: 'application/json' } });
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('freshbite-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('freshbite:session-expired'));
    }
    return Promise.reject(error);
  }
);
export default apiClient;

import axios from 'axios';

// Get API URL from environment variable
// In production, this should be set to your backend URL (e.g., https://your-api.render.com)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Ensure the URL ends with /api
const baseURL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

console.log('🔗 API Base URL:', baseURL);

// Create axios instance with base configuration
const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies with requests
    timeout: 30000, // 30 second timeout for requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('❌ Network error - server may be unreachable');
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            console.log('⚠️ Unauthorized - clearing auth and redirecting to login');
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;

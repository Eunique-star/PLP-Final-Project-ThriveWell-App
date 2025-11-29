import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log all requests
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      hasAuth: !!config.headers.Authorization
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log errors
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Set auth token
export const setAuthToken = (token) => {
  console.log('🔑 Setting auth token:', token ? 'Token set' : 'Token cleared');
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Users
export const getMedicalProfessionals = () => api.get('/api/users/medical-professionals');

// Categories
export const getCategories = () => api.get('/api/categories');
export const getCategory = (slug) => api.get(`/api/categories/${slug}`);
export const getCategoryArticles = (slug) => api.get(`/api/categories/${slug}/articles`);

// Articles
export const getArticles = () => api.get('/api/articles');
export const getArticle = (slug) => api.get(`/api/articles/${slug}`);
export const getMyArticles = () => api.get('/api/articles/my-articles');
export const createArticle = (data) => api.post('/api/articles', data);
export const updateArticle = (id, data) => api.put(`/api/articles/${id}`, data);
export const deleteArticle = (id) => api.delete(`/api/articles/${id}`);

// Applications
export const submitApplication = (data) => api.post('/api/applications', data);
export const getMyApplicationStatus = () => api.get('/api/applications/my-status');
export const getAllApplications = () => api.get('/api/applications');
export const approveApplication = (id) => api.put(`/api/applications/${id}/approve`);
export const rejectApplication = (id) => api.put(`/api/applications/${id}/reject`);

// Availability (Medical Professionals)
export const setAvailability = (data) => api.post('/api/availability', data);
export const getMyAvailability = () => api.get('/api/availability/my-availability');
export const deleteAvailability = (id) => api.delete(`/api/availability/${id}`);
export const getProfessionalAvailability = (clerkId) => api.get(`/api/availability/medical/${clerkId}`);

// Bookings
export const createBooking = (data) => api.post('/api/bookings', data);
export const getMyBookings = () => api.get('/api/bookings/my-bookings');
export const cancelBooking = (id) => api.put(`/api/bookings/${id}/cancel`);
export const getMySchedule = () => api.get('/api/bookings/my-schedule');
export const getProfessionalBookings = (clerkId) => api.get(`/api/bookings/medical/${clerkId}`);

export default api;
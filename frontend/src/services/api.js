import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests - THIS IS IMPORTANT!
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

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
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('author_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('author_token');
      localStorage.removeItem('author_data');
      window.location.href = '/creator/login';
    }
    return Promise.reject(error);
  }
);

export const authorApi = {
  // Authentification
  register: (data: any) => api.post('/authors/register', data),
  login: (data: any) => api.post('/authors/login', data),

  // Profil
  getProfile: (authorId: number) => api.get(`/authors/${authorId}/profile`),
  updateProfile: (authorId: number, data: any) => api.put(`/authors/${authorId}/profile`, data),
  deleteAccount: (authorId: number) => api.delete(`/authors/${authorId}/account`),

  // Statistiques
  getStats: (authorId: number) => api.get(`/authors/${authorId}/stats`),

  // Histoires
  getStories: (authorId: number, status?: string) => 
    api.get(`/authors/${authorId}/stories`, { params: { status } }),
};

export default api;

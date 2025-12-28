import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
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

export const storyApi = {
  // CRUD des histoires
  createStory: (data: any) => api.post('/stories', data),
  getStory: (storyId: number) => api.get(`/stories/${storyId}`),
  updateStory: (storyId: number, data: any) => api.put(`/stories/${storyId}`, data),
  deleteStory: (storyId: number) => api.delete(`/stories/${storyId}`),
  
  // Actions sur les histoires
  publishStory: (storyId: number) => api.post(`/stories/${storyId}/publish`),
  archiveStory: (storyId: number) => api.post(`/stories/${storyId}/archive`),
  
  // Genres
  getGenres: () => api.get('/stories/genres'),
  createGenre: (data: { title: string }) => api.post('/stories/genres', data),
  updateGenre: (genreId: number, data: { title: string }) => api.put(`/stories/genres/${genreId}`, data),
  deleteGenre: (genreId: number) => api.delete(`/stories/genres/${genreId}`),
};

export const chapterApi = {
  // CRUD des chapitres
  createChapter: (data: any) => api.post('/chapters', data),
  getChaptersByStory: (storyId: number) => api.get(`/chapters/story/${storyId}`),
  getChapter: (chapterId: number) => api.get(`/chapters/${chapterId}`),
  updateChapter: (chapterId: number, data: any) => api.put(`/chapters/${chapterId}`, data),
  deleteChapter: (chapterId: number) => api.delete(`/chapters/${chapterId}`),
  
  // Actions sur les chapitres
  publishChapter: (chapterId: number) => api.post(`/chapters/${chapterId}/publish`),
};

export default api;

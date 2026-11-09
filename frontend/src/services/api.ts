import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Envia cookies HttpOnly automaticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de resposta — redireciona para login se 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa estado local e redireciona
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;


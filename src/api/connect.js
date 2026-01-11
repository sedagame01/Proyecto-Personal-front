import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const destinosApi = axios.create({
    baseURL: API_URL,
    timeout: 10000 // Añadimos un pequeño timeout por seguridad
});

// Interceptor para inyectar el Token en cada petición
destinosApi.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores globales (como tokens expirados)
destinosApi.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error("La conexión ha tardado demasiado (Timeout)");
        }
        
        if (error.response?.status === 401) {
            console.log("Sesión expirada o token inválido - Cerrando sesión");
            localStorage.removeItem('token');
            // Opcional: window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default destinosApi;
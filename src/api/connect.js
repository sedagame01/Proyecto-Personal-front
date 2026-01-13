import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const destinosApi = axios.create({
    baseURL: API_URL,
    timeout: 10000 
});

destinosApi.interceptors.request.use(config => {
    // CAMBIO: Leer desde cookie
    const token = cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

destinosApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // CAMBIO: Borrar cookie en caso de error 401
            cookies.remove('token', { path: '/' });
        }
        return Promise.reject(error);
    }
);

export default destinosApi;
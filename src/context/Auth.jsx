import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import destinosApi from '../api/connect';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('checking');
    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        const token = cookies.token; // CAMBIO: Leer de la cookie
        if (!token) {
            setStatus('not-auth');
            return;
        }

        try {
            const { data } = await destinosApi.get('/renew');
            if (data.ok) {
                setUser({ 
                    uid: data.uid, 
                    rol: data.rol 
                });
                setStatus('auth');
            }
        } catch (error) {
            removeCookie('token', { path: '/' }); // CAMBIO: Limpiar cookie
            setUser(null);
            setStatus('not-auth');
        }
    };

    const login = (userData, token) => {
        // CAMBIO: Guardar en cookie (expira en 1 día)
        setCookie('token', token, { path: '/', maxAge: 86400, sameSite: 'lax' });
        setUser(userData);
        setStatus('auth');
    };

    const logout = () => {
        removeCookie('token', { path: '/' }); // CAMBIO: Borrar cookie
        setUser(null);
        setStatus('not-auth');
    };

    return (
        <AuthContext.Provider value={{ user, status, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
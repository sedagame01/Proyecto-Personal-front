import { createContext, useState, useEffect } from 'react';
import destinosApi from '../api/connect';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState('checking');

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setStatus('not-auth');
            return;
        }

        try {
            const { data } = await destinosApi.get('/renew');
            if (data.ok) {
                //para los refres el back manda el id y el rol suelto (lo mando en usuario en el login ) cambiarlo luego ¡
                setUser({ 
                    uid: data.uid, 
                    rol: data.rol 
                });
                setStatus('auth');
            } else {
                throw new Error('Token invalido');
            }
        } catch (error) {
            localStorage.clear();
            setUser(null);
            setStatus('not-auth');
        }
    };
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setStatus('auth');
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setStatus('not-auth');
    };

    return (
        <AuthContext.Provider value={{ user, status, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
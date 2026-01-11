import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Navbar } from '../components/Navbar'; 
import { Login } from '../pages/Login'; 
import { Register } from '../pages/Register';
import { Home } from '../pages/Home';
import { Profile } from '../pages/Profile';
import { Admin } from '../pages/Admin'; 
import { DestinoDetail } from '../pages/DestinoDetail';
import { PublicProfile } from '../pages/PublicProfile';
import { CreateDestino } from '../pages/CreateDestino';

export const AppRouter = () => {
    const { status, user } = useContext(AuthContext);

    if (status === 'checking') {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <>
            <Navbar /> 
            <Routes>
                <Route path="/" element={<Home />} />
                
                <Route 
                    path="/login" 
                    element={status !== 'auth' ? <Login /> : <Navigate to="/" replace />} 
                />
                
                <Route 
                    path="/register" 
                    element={status !== 'auth' ? <Register /> : <Navigate to="/" replace />} 
                />

                <Route 
                    path="/perfil" 
                    element={status === 'auth' ? <Profile /> : <Navigate to="/login" replace />} 
                />
                
                <Route 
                    path="/crear-destino" 
                    element={status === 'auth' ? <CreateDestino /> : <Navigate to="/login" replace />} 
                />
                
                <Route 
                    path="/admin" 
                    element={status === 'auth' && user?.rol === 'admin' ? <Admin /> : <Navigate to="/" replace />} 
                />

                <Route path="*" 
                element={<Navigate to="/" replace />} />

                <Route path="/destino/:id" 
                element={<DestinoDetail />} 
                />
                <Route path="/usuario/:id" 
                element={<PublicProfile />} 
                />
            </Routes>
        </>
    );
};
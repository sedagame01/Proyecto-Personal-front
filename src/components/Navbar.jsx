import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import './Navbar.css';

export const Navbar = () => {
    const { status, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">DestinosApp</Link>
            </div>

            <div className="nav-actions">
                {status === 'auth' ? (
                    <div className="user-info">
                        <Link to="/admin" className="link-admin" hidden={user?.rol !== 'admin'}>Admin</Link>
                        <Link to="/moderator" className="link-moderator" hidden={user?.rol !== 'moderator'}>Panel del moderador</Link>
                        <Link to="/perfil" className="profile-link"> Mi Perfil</Link>
                        <button onClick={handleLogout} className="btn-salir">Salir</button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="btn-login">Ingresar</Link>
                        <Link to="/register" className="btn-register">Registrar</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
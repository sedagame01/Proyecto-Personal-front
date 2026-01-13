import { useState, useContext } from 'react';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import { Link } from 'react-router-dom';
import './Login.css';

export const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [contrasenia, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await destinosApi.post('/login', { email, contrasenia });

            if (data.ok) {
                const userToLogin = { 
                    uid: data.usuario.id,
                    rol: data.usuario.role
                };
                
                // CAMBIO: Ya no tocamos localStorage aquí, 
                // la función 'login' del contexto se encarga de las cookies.
                login(userToLogin, data.token);
            }
        } catch (error) {
            alert('Credenciales no válidas');
        }
    };
    return (
        <div className="login-screen">
            <div className="login-card">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="btn-ingresar">
                        Ingresar
                    </button>
                </form>
                <div className="login-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};
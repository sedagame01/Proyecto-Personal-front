import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import { DestinoDetail } from '../pages/DestinoDetail';
import { PublicProfile } from '../pages/PublicProfile';
import './Login.css'; // Reutilizamos estilos de Login

export const Register = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        contrasenia: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await destinosApi.post('/signup', formData);

            if (data.ok) {
                const userToLogin = { 
                    uid: data.uid,
                    username: data.username,
                    rol: 'user' // Por defecto al registrarse
                };
                
                login(userToLogin, data.token);
            }
        } catch (error) {
            alert(error.response?.data?.msg || 'Error en el registro');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-card">
                <h2>Crear Cuenta</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="text" 
                        name="nombre"
                        placeholder="Nombre completo" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Correo electrónico" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="contrasenia"
                        placeholder="Contraseña (min 6 caracteres)" 
                        onChange={handleChange} 
                        required 
                    />
                    <button type="submit" className="btn-ingresar">
                        Registrarse
                    </button>
                </form>
                <div className="login-footer">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                </div>
            </div>
        </div>
    );
};
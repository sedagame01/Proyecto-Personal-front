import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import destinosApi from '../api/connect';
import '../components/profile/Profile.css';

export const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [destinos, setDestinos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userData, userDestinos] = await Promise.all([
                    destinosApi.get(`/user/usuarios/${id}`),
                    destinosApi.get(`/user/usuarios/${id}/destinos`)
                ]);
                setProfile(userData.data.data);
                setDestinos(userDestinos.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!profile) return <div>Usuario no encontrado</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar-circle">{profile.username[0]}</div>
                </div>
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    <span className="profile-role">Nivel: {profile.role}</span>
                    <p style={{marginTop: '10px'}}>Puntos Totales: {profile.puntuaciontotal}</p>
                </div>
            </div>

            <h2>Destinos Publicados</h2>
            <div className="destinos-grid">
                {destinos.filter(d => d.is_public).length > 0 ? (
                    destinos.filter(d => d.is_public).map(d => (
                    <div key={d.id} className="destino-card">
                        <img src={d.images?.[0]} alt={d.name} />
                        <div className="destino-content">
                        <h3>{d.name}</h3>
                        <p>{d.province}</p>
                        <a href={`/destino/${d.id}`} className="btn-view" style={{display:'block', textAlign:'center', marginTop:'10px', textDecoration:'none'}}>
                            Ver Destino
                        </a>
                        </div>
                    </div>
                    ))
                ) : (
                    <p>Este usuario no tiene destinos públicos.</p>
                )}
                </div>
        </div>
    );
};
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { UserDestinos } from '../components/profile/UserDestinos';
import { UserReviews } from '../components/profile/UserReviews';
import { Modal } from '../components/Modal'; 
import '../components/profile/Profile.css';

export const Profile = () => {
    const { user, status } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState(null);
    const [userDestinos, setUserDestinos] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para el Modal de "Ver"
    const [selectedDestino, setSelectedDestino] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === 'checking') return;
        if (status === 'auth' && user?.uid) {
            loadProfileData();
        } else {
            setLoading(false);
        }
    }, [status, user, location.key]);

    const loadProfileData = async () => {
        setLoading(true);
        try {
            const [resProfile, resDestinos, resReviews] = await Promise.all([
                destinosApi.get(`/user/usuarios/${user.uid}`),
                destinosApi.get(`/user/usuarios/${user.uid}/destinos`),
                destinosApi.get(`/user/usuarios/${user.uid}/reviews`)
            ]);

            if (resProfile.data.ok) setProfileData(resProfile.data.data);
            if (resDestinos.data.ok) setUserDestinos(resDestinos.data.data);
            if (resReviews.data.ok) setUserReviews(resReviews.data.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // LOGICA ELIMINAR
    const handleDeleteDestino = async (id) => {
        if (!window.confirm("¿confirma eliminar?")) return;

        try {
            const { data } = await destinosApi.delete(`/user/destinos/${id}`);
            if (data.ok) {
                setUserDestinos(prev => prev.filter(d => d.id !== id));
            }
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    // LOGICA VER
    const handleViewDestino = (destino) => {
        setSelectedDestino(destino);
        setIsModalOpen(true);
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="profile-container">
            {profileData && <ProfileHeader user={user} profileData={profileData} />}

            <section className="user-destinos">
                <div className="section-header">
                    <h2>Mis Solicitudes ({userDestinos.length})</h2>
                    <button onClick={() => navigate('/crear-destino')} className="btn-new-destino">
                        + Nuevo Destino
                    </button>
                </div>
                
                {/* Pasamos ambas funciones */}
                <UserDestinos 
                    destinos={userDestinos}
                    onDelete={handleDeleteDestino}
                    onView={handleViewDestino} 
                />
            </section>

            <section className="user-reviews">
                <h2>Mis Reseñas ({userReviews.length})</h2>
                <UserReviews reviews={userReviews} />
            </section>

            {/* Modal para ver detalles */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={selectedDestino?.name || 'Detalles'}
            >
                {selectedDestino && (
                    <div style={{ padding: '10px' }}>
                        <img 
                            src={selectedDestino.images?.[0]} 
                            alt={selectedDestino.name} 
                            style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                        />
                        <p><strong>Estado:</strong> {selectedDestino.status}</p>
                        <p><strong>Provincia:</strong> {selectedDestino.province}</p>
                        <p><strong>Descripción:</strong></p>
                        <p>{selectedDestino.description}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};
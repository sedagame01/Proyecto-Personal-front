import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import { toast } from 'react-toastify';

import './DestinoDetail.css'; // <--- IMPORTANTE: Importa el nuevo CSS

export const DestinoDetail = () => {
    const { id } = useParams();
    const { user, status } = useContext(AuthContext);
    const [destino, setDestino] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [comment, setComment] = useState('');
    const [stars, setStars] = useState(5);

    useEffect(() => {
        const fetchDestino = async () => {
            try {
                const { data } = await destinosApi.get(`/user/destinos/detalle/${id}`);
                setDestino(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestino();
    }, [id]);

    const handleReview = async (e) => {
        e.preventDefault();
        try {
            await destinosApi.post('/user/review', {
                targetId: id,
                targetType: 'destination',
                comment,
                stars
            });
            toast.success('Reseña enviada');
            window.location.reload();
        } catch (error) {
            toast.error('Error al enviar reseña');
        }
    };

    if (loading) return <div className="loading-screen">Cargando...</div>;
    if (!destino) return <div className="error-screen">Destino no encontrado</div>;

    return (
        <div className="detail-container">
            <div className="detail-card">
                
                {/* CABECERA */}
                <img 
                    src={destino.images?.[0] || '/placeholder.jpg'} 
                    alt={destino.name} 
                    className="detail-image"
                />
                
                <div className="detail-header">
                    <h1>{destino.name}</h1>
                    <p className="detail-meta">
                         {destino.province} <span>|</span> 👤 Autor: {destino.autor}
                    </p>
                </div>

                <p className="detail-description">{destino.description}</p>
                
                <hr className="detail-divider" />
                
                {/* SECCIÓN RESEÑAS */}
                <div className="reviews-section">
                    <h3>Reseñas ({destino.reviews.length})</h3>
                    
                    {/* Formulario */}
                    {status === 'auth' && (
                        <form onSubmit={handleReview} className="review-form">
                            <h4> Deja tu opinión</h4>
                            <div className="form-row">
                                <select 
                                    value={stars} 
                                    onChange={e => setStars(e.target.value)}
                                    className="star-select"
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                                    <option value="4">⭐⭐⭐⭐ Muy bueno</option>
                                    <option value="3">⭐⭐⭐ Bueno</option>
                                    <option value="2">⭐⭐ Regular</option>
                                    <option value="1">⭐ Malo</option>
                                </select>
                            </div>
                            <textarea 
                                value={comment} 
                                onChange={e => setComment(e.target.value)} 
                                placeholder="Comparte tu experiencia con este destino..."
                                className="review-textarea"
                                required
                            />
                            <button type="submit" className="btn-submit">Publicar Reseña</button>
                        </form>
                    )}

                    {/* Lista */}
                    <div className="reviews-list">
                        {destino.reviews.length > 0 ? (
                            destino.reviews.map(rev => (
                                <div key={rev.id} className="review-card">
                                    <div className="review-header-card">
                                        <span className="review-author">{rev.username}</span>
                                        <span className="review-stars">{'⭐'.repeat(rev.stars)}</span>
                                    </div>
                                    <p className="review-text">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{color: '#888'}}>Aún no hay reseñas. ¡Sé el primero!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
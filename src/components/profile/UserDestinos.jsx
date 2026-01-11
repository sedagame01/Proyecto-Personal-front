import './Profile.css';

export const UserDestinos = ({ destinos, onDelete, onView }) => {
    if (destinos.length === 0) {
        return (
            <div className="empty-state">
                <p>No has creado destinos aún</p>
                <a href="/crear-destino" className="btn-primary">Crear mi primer destino</a>
            </div>
        );
    }

    return (
        <div className="destinos-grid">
            {destinos.map(destino => (
                <div key={destino.id} className="destino-card">
                    <img 
                        src={destino.images?.[0] || '/placeholder.jpg'} 
                        alt={destino.name} 
                    />
                    <div className="destino-content">
                        <h3>{destino.name}</h3>
                        <p>{destino.description?.substring(0, 60)}...</p>
                        <div className="destino-status">
                            <span className={`status-badge ${destino.status}`}>
                                {destino.status === 'active' ? '✅ Aprobado' : 
                                 destino.status === 'pending' ? '⏳ Pendiente' : 
                                 '❌ Rechazado'}
                            </span>
                        </div>
                        <div className="destino-actions">
                            {/* AQUI EL CAMBIO: Agregamos onClick */}
                            <button 
                                className="btn-view" 
                                onClick={() => onView(destino)}
                            >
                                Ver
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={() => onDelete(destino.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
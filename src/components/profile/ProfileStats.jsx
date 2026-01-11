import './Profile.css';

export const ProfileStats = ({ profileData, destinosCount, reviewsCount }) => {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-value">{profileData?.puntuaciontotal || 0}</div>
                <div className="stat-label">Puntos Totales</div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">🗺️</div>
                <div className="stat-value">{destinosCount}</div>
                <div className="stat-label">Destinos Creados</div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{reviewsCount}</div>
                <div className="stat-label">Reseñas Escritas</div>
            </div>
            <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-value">
                    {profileData?.badges?.length || 0}
                </div>
                <div className="stat-label">Insignias</div>
            </div>
        </div>
    );
};
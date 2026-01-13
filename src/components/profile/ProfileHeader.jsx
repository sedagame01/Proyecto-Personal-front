import './Profile.css';

export const ProfileHeader = ({ user, profileData, onEdit }) => {
    return (
        <div className="profile-header">
            <div className="profile-avatar">
                <div className="avatar-circle">
                    {profileData?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
            </div>
            <div className="profile-info">
                <h1>{profileData?.username || 'Usuario'}</h1>
                <p className="profile-role">
                    {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
                <p className="profile-email"> {profileData?.email}</p>
                <p className="profile-score">🏆 Puntos: {profileData?.puntuaciontotal || 0}</p>
            </div>
            
        </div>
    );
};
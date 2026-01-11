import { useState } from 'react';
import './Profile.css';

export const ProfileForm = ({ profileData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        username: profileData?.username || '',
        email: profileData?.email || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="edit-form-container">
            <h3>Editar Información</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
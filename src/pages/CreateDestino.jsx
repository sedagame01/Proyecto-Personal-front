import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import './CreateDestino.css';

export const CreateDestino = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        province: '',
        images: [''],
        status: 'pending',
        is_public: true
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // CreateDestino.jsx

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await destinosApi.post('/user/sugerir', { 
            ...formData,
            // Nos aseguramos de limpiar las imágenes vacías
            images: formData.images.filter(img => img.trim() !== '')
        });

        if (response.data.ok) {
            alert('¡Destino enviado para aprobación!');
            // Redirigir al perfil
            navigate('/perfil');
        } else {
            setError('El servidor no confirmó el guardado.');
        }
    } catch (error) {
        console.error("Error al enviar:", error);
        setError(error.response?.data?.msg || 'Error al conectar con el servidor');
    } finally {
        // ESTO ES VITAL: Si no se pone false, el botón se queda deshabilitado y la pantalla "cargando"
        setLoading(false); 
    }
};

    const addImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, '']
        });
    };

    const updateImage = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    return (
        <div className="create-destino-container">
            <div className="create-destino-card">
                <h1>Crear Nuevo Destino</h1>
                <p className="subtitle">Comparte un lugar especial con la comunidad</p>
                
                <form onSubmit={handleSubmit} className="destino-form">
                    <div className="form-group">
                        <label htmlFor="name">Nombre del destino *</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Ej: Playa Escondida, Montaña Azul"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Descripción *</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe el lugar, qué actividades se pueden hacer, por qué es especial..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="province">Provincia *</label>
                        <select
                            id="province"
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value})}
                            required
                        >
                            <option value="">Selecciona una provincia</option>
                            <option value="Azuay">Azuay</option>
                            <option value="Bolívar">Bolívar</option>
                            <option value="Cañar">Cañar</option>
                            <option value="Carchi">Carchi</option>
                            <option value="Chimborazo">Chimborazo</option>
                            <option value="Cotopaxi">Cotopaxi</option>
                            <option value="El Oro">El Oro</option>
                            <option value="Esmeraldas">Esmeraldas</option>
                            <option value="Galápagos">Galápagos</option>
                            <option value="Guayas">Guayas</option>
                            <option value="Imbabura">Imbabura</option>
                            <option value="Loja">Loja</option>
                            <option value="Los Ríos">Los Ríos</option>
                            <option value="Manabí">Manabí</option>
                            <option value="Morona Santiago">Morona Santiago</option>
                            <option value="Napo">Napo</option>
                            <option value="Orellana">Orellana</option>
                            <option value="Pastaza">Pastaza</option>
                            <option value="Pichincha">Pichincha</option>
                            <option value="Santa Elena">Santa Elena</option>
                            <option value="Santo Domingo">Santo Domingo</option>
                            <option value="Sucumbíos">Sucumbíos</option>
                            <option value="Tungurahua">Tungurahua</option>
                            <option value="Zamora Chinchipe">Zamora Chinchipe</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Imágenes (URLs)</label>
                        {formData.images.map((image, index) => (
                            <div key={index} className="image-input-group">
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => updateImage(index, e.target.value)}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={() => removeImage(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-image-btn"
                            onClick={addImageField}
                        >
                            + Añadir otra imagen
                        </button>
                        <p className="help-text">Puedes agregar URLs de imágenes públicas</p>
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                            />
                            <span>Hacer este destino público (visible para todos)</span>
                        </label>
                        <p className="help-text">Si desmarcas, solo tú podrás ver este destino</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/perfil')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar para aprobación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
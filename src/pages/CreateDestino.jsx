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
                                <option value="A Coruña">A Coruña</option>
                                <option value="Álava">Álava</option>
                                <option value="Albacete">Albacete</option>
                                <option value="Alicante">Alicante</option>
                                <option value="Almería">Almería</option>
                                <option value="Asturias">Asturias</option>
                                <option value="Ávila">Ávila</option>
                                <option value="Badajoz">Badajoz</option>
                                <option value="Baleares">Baleares</option>
                                <option value="Barcelona">Barcelona</option>
                                <option value="Burgos">Burgos</option>
                                <option value="Cáceres">Cáceres</option>
                                <option value="Cádiz">Cádiz</option>
                                <option value="Cantabria">Cantabria</option>
                                <option value="Castellón">Castellón</option>
                                <option value="Ceuta">Ceuta</option>
                                <option value="Ciudad Real">Ciudad Real</option>
                                <option value="Córdoba">Córdoba</option>
                                <option value="Cuenca">Cuenca</option>
                                <option value="Girona">Girona</option>
                                <option value="Granada">Granada</option>
                                <option value="Guadalajara">Guadalajara</option>
                                <option value="Guipúzcoa">Guipúzcoa</option>
                                <option value="Huelva">Huelva</option>
                                <option value="Huesca">Huesca</option>
                                <option value="Jaén">Jaén</option>
                                <option value="La Rioja">La Rioja</option>
                                <option value="Las Palmas">Las Palmas</option>
                                <option value="León">León</option>
                                <option value="Lleida">Lleida</option>
                                <option value="Lugo">Lugo</option>
                                <option value="Madrid">Madrid</option>
                                <option value="Málaga">Málaga</option>
                                <option value="Melilla">Melilla</option>
                                <option value="Murcia">Murcia</option>
                                <option value="Navarra">Navarra</option>
                                <option value="Ourense">Ourense</option>
                                <option value="Palencia">Palencia</option>
                                <option value="Pontevedra">Pontevedra</option>
                                <option value="Salamanca">Salamanca</option>
                                <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
                                <option value="Segovia">Segovia</option>
                                <option value="Sevilla">Sevilla</option>
                                <option value="Soria">Soria</option>
                                <option value="Tarragona">Tarragona</option>
                                <option value="Teruel">Teruel</option>
                                <option value="Toledo">Toledo</option>
                                <option value="Valencia">Valencia</option>
                                <option value="Valladolid">Valladolid</option>
                                <option value="Vizcaya">Vizcaya</option>
                                <option value="Zamora">Zamora</option>
                                <option value="Zaragoza">Zaragoza</option>
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
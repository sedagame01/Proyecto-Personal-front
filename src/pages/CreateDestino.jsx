import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth';
import destinosApi from '../api/connect';
import { toast } from 'react-toastify';
import './CreateDestino.css';

export const CreateDestino = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        province: '',
        is_public: true
    });
    
    const [files, setFiles] = useState([]); // Cambiar de URLs a archivos
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Crear FormData en lugar de enviar JSON
            const formDataToSend = new FormData();
            
            // Agregar campos del formulario
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('province', formData.province);
            formDataToSend.append('is_public', formData.is_public);
            
            // Agregar archivos (cada uno con el campo 'file')
            files.forEach((file, index) => {
                formDataToSend.append('file', file); // 'file' debe coincidir con el backend
            });
            
            // Obtener token del contexto
            const token = user?.token; // Ajusta según cómo tengas el token
            
            const response = await destinosApi.post('/user/sugerir', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.ok) {
                toast.success('¡Destino enviado para aprobación!');
                navigate('/perfil');
            } else {
                toast.error('Error al guardar el destino');
                setError('El servidor no confirmó el guardado.');
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            toast.error('Error al conectar con el servidor');   
            setError(error.response?.data?.msg || 'Error al conectar con el servidor');
        } finally {
            setLoading(false); 
        }
    };

    const handleFileChange = (e, index) => {
        const newFiles = [...files];
        newFiles[index] = e.target.files[0];
        setFiles(newFiles);
    };

    const addFileField = () => {
        setFiles([...files, null]);
    };

    const removeFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    };

    // Función para mostrar vista previa
    const getPreviewUrl = (file) => {
        if (!file) return '';
        return URL.createObjectURL(file);
    };

    return (
        <div className="create-destino-container">
            <div className="create-destino-card">
                <h1>Crear Nuevo Destino</h1>
                <p className="subtitle">Comparte un lugar especial con la comunidad</p>
                
                <form onSubmit={handleSubmit} className="destino-form" encType="multipart/form-data">
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
                        <label>Imágenes</label>
                        {files.map((file, index) => (
                            <div key={index} className="file-input-group">
                                <div className="file-preview">
                                    {file && (
                                        <div className="preview-container">
                                            <img 
                                                src={getPreviewUrl(file)} 
                                                alt="Vista previa" 
                                                className="image-preview"
                                            />
                                            <span className="file-name">{file.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="file-actions">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, index)}
                                        className="file-input"
                                    />
                                    <button
                                        type="button"
                                        className="remove-file-btn"
                                        onClick={() => removeFile(index)}
                                    >
                                        ✕ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="add-file-btn"
                            onClick={addFileField}
                        >
                            + Añadir imagen
                        </button>
                        <p className="help-text">Formatos recomendados: JPG, PNG, WEBP. Tamaño máximo: 5MB</p>
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
                            disabled={loading || files.length === 0}
                        >
                            {loading ? 'Enviando...' : 'Enviar para aprobación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
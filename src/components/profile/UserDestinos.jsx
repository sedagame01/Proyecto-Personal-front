import { useState, useEffect } from 'react';
import destinosApi from '../../api/connect'
import { Modal } from '../Modal';
import './Profile.css';


export const UserDestinos = ({ destinos, onDelete, onView }) => {
    
    const [view, setView] = useState('destinos');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        fetchData(view);
    }, [view]);

    const fetchData =async (id)=>{
        setView(id);
        try{
            const {data}= await destinosApi.get(`/user/destinos/detalle/:${id}`)
            const responseData = data.data || [];
            setSelectedItem(responseData);
        }catch(error){
        console.log('error al cargar los detalles del destino', error)
        }
        } 

    if (destinos.length === 0) {
        return (
            <div className="empty-state">
                <p>No has creado destinos aún</p>
                <a href="/crear-destino" className="btn-primary">Crear mi primer destino</a>
            </div>
        );
    }
    const handleEdit = async (item) => {
        if (view === 'destinos') {
            try {
                // Obtenemos los detalles completos (fotos, provincia, reviews) del backend
                const { data } = await destinosApi.get(`/user/destinos/detalle/${item.id}`);
                if (data.ok) {
                    setSelectedItem(data.data);
                }
            } catch (error) {
                console.error("Error al cargar detalle completo:", error);
                setSelectedItem(item); 
            }
        } else {
            setSelectedItem(item);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            
                await destinosApi.put(`/admin/destinations/${selectedItem.id}`, {
                    name: selectedItem.name,
                    description: selectedItem.description,
                    province: selectedItem.province,
                    images: Array.isArray(selectedItem.images) ? selectedItem.images : selectedItem.images.split(','),
                    is_public: selectedItem.is_public,
                });
            
            alert("Actualizado con éxito");
            setIsModalOpen(false);
            fetchData(view);
        } catch (error) {
            alert("Error al guardar cambios");
        }
    };

    return (
        <>
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
                            <button 
                                className="btn-view" 
                                onClick={(e) => onView(destino,e.target.textContent)}
                            >
                                Ver
                            </button>
                            <button className="btn-edit" onClick={(e) => handleEdit(destino)}>Editar</button>
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

                    <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave}
            >
                <div className="modal-content">
                    <div className="form-group">
                        <label>Nombre del Destino *</label>
                        <input 
                            type="text" 
                            value={selectedItem?.name || ''} 
                            onChange={(e) => setSelectedItem({
                                ...selectedItem, 
                                name: e.target.value
                            })} 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Provincia *</label>
                        <input 
                            type="text" 
                            value={selectedItem?.province || ''} 
                            onChange={(e) => setSelectedItem({
                                ...selectedItem, 
                                province: e.target.value
                            })} 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea 
                            value={selectedItem?.description || ''} 
                            onChange={(e) => setSelectedItem({
                                ...selectedItem, 
                                description: e.target.value
                            })} 
                            rows="4"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>URLs de Imágenes (separadas por coma)</label>
                        <textarea 
                            value={Array.isArray(selectedItem?.images) 
                                ? selectedItem.images.join(', ') 
                                : selectedItem?.images || ''} 
                            onChange={(e) => {
                                // Convertir string a array y limpiar espacios
                                const imageUrls = e.target.value
                                    .split(',')
                                    .map(url => url.trim())
                                    .filter(url => url !== '');
                                
                                setSelectedItem({
                                    ...selectedItem, 
                                    images: imageUrls
                                });
                            }}
                            placeholder="https://imagen1.jpg, https://imagen2.jpg"
                            rows="3"
                        />
                        <small className="help-text">
                            Separe las URLs con comas. Las URLs deben ser válidas.
                        </small>
                    </div>
                </div>
            </Modal>
       </>         
    );
    
};
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import destinosApi from '../api/connect';
import { Modal } from '../components/Modal';
import './Admin.css';

export const Admin = () => {
    const navigate = useNavigate(); // Solución al ReferenceError: navigate
    const [view, setView] = useState('pendientes'); // Vista por defecto
    const [dataList, setDataList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchData(view);
    }, [view]);

    const fetchData = async (tipo) => {
        setView(tipo);
        try {
            const endpoints = {
                'usuarios': '/admin/users',
                'pendientes': '/admin/destinations/pending',
                'aprobados': '/admin/destinations/all'
            };
            const { data } = await destinosApi.get(endpoints[tipo]);
            const responseData = data.data || [];
            
            if (tipo === 'aprobados') {
                setDataList(responseData.filter(dest => dest.status === 'active'));
            } else {
                setDataList(responseData);
            }
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    // CARGA AUTOMÁTICA DE DATOS COMPLETOS AL EDITAR
    const handleEdit = async (item) => {
        if (view === 'aprobados' || view === 'pendientes') {
            try {
                // Obtenemos los detalles completos (fotos, provincia, reviews) del backend
                const { data } = await destinosApi.get(`/user/destinos/detalle/${item.id}`);
                if (data.ok) {
                    setSelectedItem(data.data);
                }
            } catch (error) {
                console.error("Error al cargar detalle completo:", error);
                setSelectedItem(item); // Fallback
            }
        } else {
            setSelectedItem(item);
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (view === 'usuarios') {
                await destinosApi.put(`/admin/users/${selectedItem.id}`, selectedItem);
            } else {
                // Enviar actualización completa de destino
                await destinosApi.put(`/admin/destinations/${selectedItem.id}`, {
                    name: selectedItem.name,
                    description: selectedItem.description,
                    province: selectedItem.province,
                    images: Array.isArray(selectedItem.images) ? selectedItem.images : selectedItem.images.split(','),
                    is_public: selectedItem.is_public
                });
            }
            alert("Actualizado con éxito");
            setIsModalOpen(false);
            fetchData(view);
        } catch (error) {
            alert("Error al guardar cambios");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
        try {
            const endpoint = view === 'usuarios' ? `/admin/users/${id}` : `/admin/destinations/${id}`;
            await destinosApi.delete(endpoint);
            setDataList(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("¿Eliminar esta reseña permanentemente?")) return;
        try {
            await destinosApi.delete(`/admin/reviews/${reviewId}`);
            setSelectedItem(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r.id !== reviewId)
            }));
        } catch (error) {
            alert("Error al borrar la reseña");
        }
    };

    const handleApprove = async (id) => {
        try {
            const { data } = await destinosApi.patch(`/admin/destinations/approve/${id}`);
            if (data.ok) fetchData(view);
        } catch (error) {
            alert("Error al aprobar");
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Administración</h1>
                <div className="admin-nav">
                    <button onClick={() => setView('pendientes')} className={view === 'pendientes' ? 'active' : ''}>Pendientes</button>
                    <button onClick={() => setView('aprobados')} className={view === 'aprobados' ? 'active' : ''}>Aprobados</button>
                    <button onClick={() => setView('usuarios')} className={view === 'usuarios' ? 'active' : ''}>Usuarios</button>
                    <button onClick={() => navigate('/sugerir')} className="btn-create-direct"> + Crear Destino </button>
                </div>
            </header>

            <main className="admin-content">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{view === 'usuarios' ? 'Username' : 'Nombre'}</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{view === 'usuarios' ? item.username : item.name}</td>
                                <td>
                                    {view === 'pendientes' && (
                                        <button className="btn-approve" onClick={() => handleApprove(item.id)}>Aprobar</button>
                                    )}
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={`Editar ${view === 'usuarios' ? 'Usuario' : 'Destino'}`}
                onSave={handleSave}
            >
                <div className="admin-edit-form">
                    {view === 'usuarios' ? (
                        <>
                            <label>Nombre de Usuario</label>
                            <input type="text" value={selectedItem?.username || ''} onChange={(e) => setSelectedItem({...selectedItem, username: e.target.value})} />
                            <label>Email</label>
                            <input type="email" value={selectedItem?.email || ''} onChange={(e) => setSelectedItem({...selectedItem, email: e.target.value})} />
                        </>
                    ) : (
                        <>
                            <label>Nombre del Destino</label>
                            <input type="text" value={selectedItem?.name || ''} onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})} />
                            
                            <label>Provincia</label>
                            <input type="text" value={selectedItem?.province || ''} onChange={(e) => setSelectedItem({...selectedItem, province: e.target.value})} />
                            
                            <label>Descripción</label>
                            <textarea value={selectedItem?.description || ''} onChange={(e) => setSelectedItem({...selectedItem, description: e.target.value})} />
                            
                            <label>URLs de Imágenes (separadas por coma)</label>
                            <textarea 
                                value={Array.isArray(selectedItem?.images) ? selectedItem.images.join(', ') : selectedItem?.images || ''} 
                                onChange={(e) => setSelectedItem({...selectedItem, images: e.target.value})}
                                placeholder="https://imagen1.jpg, https://imagen2.jpg"
                            />

                            <div className="admin-reviews-management">
                                <h3>Gestión de Reseñas</h3>
                                <div className="admin-reviews-list">
                                    {selectedItem?.reviews?.length > 0 ? (
                                        selectedItem.reviews.map(rev => (
                                            <div key={rev.id} className="admin-review-card">
                                                <p><strong>{rev.username} (⭐{rev.stars}):</strong> {rev.comment}</p>
                                                <button onClick={() => handleDeleteReview(rev.id)} className="btn-del-rev">Eliminar</button>
                                            </div>
                                        ))
                                    ) : <p>Sin reseñas.</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};
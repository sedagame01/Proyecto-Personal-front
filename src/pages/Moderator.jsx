// Moderator.jsx - CORREGIDO
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import destinosApi from '../api/connect';
import { Modal } from '../components/Modal';
import './Moderator.css';

export const Moderator = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('pendientes');
    const [dataList, setDataList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'editRole'

    useEffect(() => {
        fetchData(view);
    }, [view]);

    const fetchData = async (tipo) => {
        setView(tipo);
        try {
            const endpoints = {
                'usuarios': '/admin/users',
                'pendientes': '/admin/destinations/pending',
                'aprobados': '/admin/destinations/all',
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

    const handleViewOrEdit = async (item, mode = 'view') => {
        if (view === 'aprobados' || view === 'pendientes') {
            try {
                const { data } = await destinosApi.get(`/user/destinos/detalle/${item.id}`);
                if (data.ok) {
                    setSelectedItem(data.data);
                    setModalMode(mode);
                    setIsModalOpen(true);
                }
            } catch (error) {
                console.error("Error al cargar detalle completo:", error);
                setSelectedItem(item);
                setModalMode(mode);
                setIsModalOpen(true);
            }
        } else {
            setSelectedItem(item);
            setModalMode(mode);
            setIsModalOpen(true);
        }
    };

    const handleSave = async () => {
        try {
            if (view === 'usuarios') {
                await destinosApi.put(`/admin/users/${selectedItem.id}`, { 
                    role: selectedItem.role,
                    username: selectedItem.username, 
                    email: selectedItem.email 
                });
                toast.success("Usuario actualizado con éxito");
            } else {
                await destinosApi.put(`/admin/destinations/${selectedItem.id}`, {
                    name: selectedItem.name,
                    description: selectedItem.description,
                    province: selectedItem.province,
                    images: Array.isArray(selectedItem.images) ? selectedItem.images : selectedItem.images.split(','),
                    is_public: selectedItem.is_public,
                });
                toast.success("Destino actualizado con éxito");
            }
            setIsModalOpen(false);
            fetchData(view);
        } catch (error) {
            toast.error("Error al guardar cambios");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
        try {
            const endpoint = view === 'usuarios' ? `/admin/users/${id}` : `/admin/destinations/reject/${id}`;
            await destinosApi.delete(endpoint);
            setDataList(prev => prev.filter(item => item.id !== id));
            toast.success("Elemento eliminado con éxito");
        } catch (error) {
            toast.error("Error al eliminar el elemento");
        }
    };

    const handleApprove = async (id) => {
        try {
            const { data } = await destinosApi.patch(`/admin/destinations/approve/${id}`);
            if (data.ok) {
                fetchData(view);
                toast.success("Destino aprobado");
            }
        } catch (error) {
            toast.error("Error al aprobar");
        }
    };

    const handleReject = async (id) => {
        try {
            const { data } = await destinosApi.patch(`/admin/destinations/reject/${id}`);
            if (data.ok) {
                fetchData(view);
                toast.success("Destino rechazado");
            }
        } catch (error) {
            toast.error("Error al rechazar");
        }
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Panel de Moderación</h1>
                <div className="admin-nav">
                    <button onClick={() => setView('pendientes')} className={view === 'pendientes' ? 'active' : ''}>Pendientes</button>
                    <button onClick={() => setView('aprobados')} className={view === 'aprobados' ? 'active' : ''}>Aprobados</button>
                    <button onClick={() => setView('usuarios')} className={view === 'usuarios' ? 'active' : ''}>Usuarios</button>
                </div>
            </header>

            <main className="admin-content">
    <table className="admin-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>{view === 'usuarios' ? 'Username' : 'Nombre'}</th>
                {view === 'usuarios' && <th>Rol</th>}
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {dataList.map(item => (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{view === 'usuarios' ? item.username : item.name}</td>
                    {view === 'usuarios' && <td>{item.role}</td>}
                    <td>
                        {view === 'pendientes' && (
                            <>
                                <button className="btn-approve" onClick={() => handleApprove(item.id)}>Aprobar</button>
                                <button className="btn-reject" onClick={() => handleReject(item.id)}>Rechazar</button>
                            </>  
                        )}
                        <button className="btn-edit" onClick={() => handleViewOrEdit(item, 'view')}>Ver</button>
                        {view !== 'pendientes' && (
                            <button className="btn-edit" onClick={() => handleViewOrEdit(item, view === 'usuarios' ? 'editRole' : 'edit')}>
                                {view === 'usuarios' ? 'Cambiar Rol' : 'Editar'}
                            </button>
                        )}
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
                title={modalMode === 'editRole' ? 'Cambiar Rol de Usuario' : 
                       modalMode === 'edit' ? 'Editar Destino' : 
                       view === 'usuarios' ? 'Información de Usuario' : 'Detalles del Destino'}
                onSave={modalMode !== 'view' ? handleSave : null}
                mode={modalMode}
            >
                <div className="admin-edit-form">
                    {view === 'usuarios' ? (
                        <>
                            <label>Nombre de Usuario</label>
                            <input 
                                type="text" 
                                value={selectedItem?.username || ''} 
                                readOnly={modalMode !== 'editRole'}
                                onChange={(e) => modalMode === 'editRole' && setSelectedItem({...selectedItem, username: e.target.value})}
                            />
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={selectedItem?.email || ''} 
                                readOnly={modalMode !== 'editRole'}
                                onChange={(e) => modalMode === 'editRole' && setSelectedItem({...selectedItem, email: e.target.value})}
                            />
                            <label>Rol</label>
                            <select
                                value={selectedItem?.role || 'user'}
                                onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
                                disabled={modalMode === 'view'}
                                className={modalMode === 'view' ? 'readonly-select' : ''}
                            >
                                <option value="user">Usuario</option>
                                <option value="moderator">Moderador</option>
                                <option value="banned">Baneado</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <label>Nombre del Destino</label>
                            <input 
                                type="text" 
                                value={selectedItem?.name || ''} 
                                readOnly={modalMode === 'view'}
                                onChange={(e) => modalMode === 'edit' && setSelectedItem({...selectedItem, name: e.target.value})}
                            />
                            
                            <label>Provincia</label>
                            <input 
                                type="text" 
                                value={selectedItem?.province || ''} 
                                readOnly={modalMode === 'view'}
                                onChange={(e) => modalMode === 'edit' && setSelectedItem({...selectedItem, province: e.target.value})}
                            />
                            
                            <label>Descripción</label>
                            <textarea 
                                value={selectedItem?.description || ''} 
                                readOnly={modalMode === 'view'}
                                onChange={(e) => modalMode === 'edit' && setSelectedItem({...selectedItem, description: e.target.value})}
                            />
                            
                            <label>URLs de Imágenes (separadas por coma)</label>
                            <textarea 
                                value={Array.isArray(selectedItem?.images) ? selectedItem.images.join(', ') : selectedItem?.images || ''} 
                                onChange={(e) => modalMode === 'edit' && setSelectedItem({...selectedItem, images: e.target.value})}
                                readOnly={modalMode === 'view'}
                                placeholder="https://imagen1.jpg, https://imagen2.jpg"
                            />
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};
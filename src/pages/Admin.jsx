// Admin.jsx - CORREGIDO
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import destinosApi from '../api/connect';
import { Modal } from '../components/Modal';
import { toast } from 'react-toastify';

import './Admin.css';

export const Admin = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('pendientes');
    const [dataList, setDataList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view' o 'editRole'

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
            toast.error("Error al obtener datos");
            console.error("Error al obtener datos:", error);
        }
    };

    const handleView = async (item, mode = 'view') => {
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
                toast.error("Error al cargar detalle completo, mostrando datos básicos");
            }
        } else {
            setSelectedItem(item);
            setModalMode(mode);
            setIsModalOpen(true);
        }
    };

    const handleChangeRole = async () => {
        try {
            await destinosApi.put(`/admin/users/${selectedItem.id}`, { 
                role: selectedItem.role,
                username: selectedItem.username, 
                email: selectedItem.email 
            });
            toast.success("Rol actualizado con éxito");
            setIsModalOpen(false);
            fetchData(view);
        } catch (error) {
            toast.error("Error al actualizar rol");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;
        try {
            const endpoint = view === 'usuarios' ? `/admin/users/${id}` : `/admin/destinations/reject/${id}`;
            await destinosApi.delete(endpoint);
            setDataList(prev => prev.filter(item => item.id !== id));
            toast.success("Eliminado con éxito");
        } catch (error) {
            toast.error("Error al eliminar destino");
        }
    };

    const handleApprove = async (id) => {
        try {
            const { data } = await destinosApi.patch(`/admin/destinations/approve/${id}`);
            if (data.ok) fetchData(view);
            toast.success("Destino aprobado");
        } catch (error) {
            toast.error("Error al aprobar");
        }
    };

    const handleReject = async (id) => {
        try {
            const { data } = await destinosApi.patch(`/admin/destinations/reject/${id}`);
            if (data.ok) fetchData(view);
            toast.success("Destino rechazado");
        } catch (error) {
            toast.error("Error al rechazar");
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
                        <button className="btn-edit" onClick={() => handleView(item, 'view')}>Ver</button>
                        {view === 'usuarios' && (
                            <button className="btn-edit" onClick={() => handleView(item, 'editRole')}>Cambiar Rol</button>
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
                       view === 'usuarios' ? 'Información de Usuario' : 'Detalles del Destino'}
                onSave={modalMode === 'editRole' ? handleChangeRole : null}
                mode={modalMode}
            >
                <div className="admin-edit-form">
                    {view === 'usuarios' ? (
                        <>
                            <label>Nombre de Usuario</label>
                            <input 
                                type="text" 
                                value={selectedItem?.username || ''} 
                                readOnly={modalMode === 'view'}
                            />
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={selectedItem?.email || ''} 
                                readOnly={modalMode === 'view'}
                            />
                            <label>Rol Actual</label>
                            <select
                                value={selectedItem?.role || 'user'}
                                onChange={(e) => setSelectedItem({ ...selectedItem, role: e.target.value })}
                                disabled={modalMode === 'view'}
                                className={modalMode === 'view' ? 'readonly-select' : ''}
                            >
                                <option value="user">Usuario</option>
                                <option value="moderator">Moderador</option>
                                <option value="admin">Administrador</option>
                                <option value="banned">Baneado</option>
                            </select>
                        </>
                    ) : (
                        <>
                            <label>Nombre del Destino</label>
                            <input type="text" value={selectedItem?.name || ''} readOnly />
                            
                            <label>Provincia</label>
                            <input type="text" value={selectedItem?.province || ''} readOnly />
                            
                            <label>Descripción</label>
                            <textarea value={selectedItem?.description || ''} readOnly />
                            
                            <label>URLs de Imágenes</label>
                            <textarea 
                                value={Array.isArray(selectedItem?.images) ? selectedItem.images.join(', ') : selectedItem?.images || ''} 
                                readOnly
                            />

                            <div className="admin-reviews-management">
                                <h3>Reseñas</h3>
                                <div className="admin-reviews-list">
                                    {selectedItem?.reviews?.length > 0 ? (
                                        selectedItem.reviews.map(rev => (
                                            <div key={rev.id} className="admin-review-card">
                                                <p><strong>{rev.username} (⭐{rev.stars}):</strong> {rev.comment}</p>
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
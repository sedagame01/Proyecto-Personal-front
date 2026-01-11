import './Modal.css';

export const Modal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancelar</button>
                    <button className="btn-save" onClick={onSave}>Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};
import React from 'react';
import { useModuleModal } from '../../hooks/useModuleModal';

const ModuleModal = ({ isOpen, onClose, onSave, module = null }) => {
  const {
    moduleName,
    errorMessage,
    handleSubmit,
    handleCancel,
    handleInputChange,
    isFormValid,
    modalTitle,
    submitButtonText,
  } = useModuleModal(isOpen, onClose, onSave, module);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{modalTitle}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="module-name">Module name</label>
              <input
                id="module-name"
                type="text"
                value={moduleName}
                onChange={handleInputChange}
                placeholder="Introduction to Trigonometry"
                className={`form-input ${errorMessage ? 'error' : ''}`}
                autoFocus
              />
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={!isFormValid}>
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;

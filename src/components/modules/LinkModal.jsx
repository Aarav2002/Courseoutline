import React from 'react';
import { useLinkModal } from '../../hooks/useLinkModal';

const LinkModal = ({ isOpen, onClose, onSave, moduleId, currentItem }) => {
  const {
    linkTitle,
    linkUrl,
    handleSubmit,
    handleCancel,
    handleTitleChange,
    handleUrlChange,
    isFormValid,
    titleError,
    urlError,
  } = useLinkModal(isOpen, onClose, onSave, moduleId, currentItem);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{currentItem ? 'Edit link' : 'Add a link'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={handleTitleChange}
                placeholder="Link title"
                className={`form-input ${titleError ? 'error' : ''}`}
                autoFocus
              />
              {titleError && <span className="error-message">{titleError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                className={`form-input ${urlError ? 'error' : ''}`}
              />
              {urlError && <span className="error-message">{urlError}</span>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={!isFormValid}
            >
              {currentItem ? 'Save changes' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;

import React from 'react';
import { useUploadModal } from '../../hooks/useUploadModal';

const UploadModal = ({ isOpen, onClose, onSave, moduleId, currentItem }) => {
  const {
    fileTitle,
    selectedFile,
    handleSubmit,
    handleCancel,
    handleFileChange,
    handleTitleChange,
    isFormValid,
    formatFileSize,
    titleError,
    fileError,
  } = useUploadModal(isOpen, onClose, onSave, moduleId, currentItem);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{currentItem ? 'Edit file' : 'Upload file'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="file-title">File title</label>
              <input
                id="file-title"
                type="text"
                value={fileTitle}
                onChange={handleTitleChange}
                placeholder="File title"
                className={`form-input ${titleError ? 'error' : ''}`}
                autoFocus
              />
              {titleError && <span className="error-message">{titleError}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="file-upload">{currentItem ? 'Replace file (optional)' : 'Select file'}</label>
              {currentItem && (
                <div className="current-file">
                  <span className="current-file-label">Current file:</span>
                  <span className="current-file-name">{currentItem.fileName}</span>
                  <span className="current-file-size">
                    ({formatFileSize(currentItem.fileSize)})
                  </span>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className={`file-input ${fileError ? 'error' : ''}`}
              />
              {selectedFile && (
                <div className="selected-file">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
              )}
              {fileError && <span className="error-message">{fileError}</span>}
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
              {currentItem ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useModuleItem } from '../../hooks/useModuleItem';

const ModuleItem = ({ item, onDelete, onEdit, searchTerm, draggedItem, dragOverItem }) => {
  if (!item) return null;

  const {
    isEditing, editValue, isOptionsOpen, isPreviewOpen, isContextMenuOpen,
    contextMenuPosition, itemRef, itemIcon, handleDelete, handleEdit,
    handleSaveEdit, handleCancelEdit, handleDownload, handleFileClick,
    handleContextMenu, handleKeyPress, toggleOptions, closePreview,
    closeContextMenu, isFileDownloadable, formatFileSize, setEditValue,
  } = useModuleItem(item, onDelete, onEdit, searchTerm);

  const normalizedType = (() => {
    if (item.url && !item.fileName) {
      return 'link';
    }
    if (item.fileName) {
      return 'file';
    }
    return item.type || 'unknown';
  })();
  
  const displayIcon = itemIcon;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: `item-${item.id}` 
  });

  // Prevent drag over feedback on self and improve visual stability
  const isDraggedOver = dragOverItem === `item-${item.id}` && 
    draggedItem && 
    draggedItem !== `item-${item.id}` && 
    draggedItem.startsWith('item-');

  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition: isDragging ? 'none' : transition, // Disable transition while dragging for smoothness
    opacity: isDragging ? 0.8 : 1 
  };

  const HighlightText = ({ text, highlight }) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase()
        ? <mark key={i} className="search-highlight">{part}</mark>
        : part
    );
  };

  return (
    <div
      ref={(node) => { setNodeRef(node); if (itemRef) itemRef.current = node; }}
      style={style}
      className={`module-item ${normalizedType}-item ${isDragging ? 'dragging' : ''} ${isDraggedOver ? 'drag-over' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <div className="item-content">
        {/* Drag handle */}
        <div className="item-drag-handle" {...attributes} {...listeners}>
          <span className="drag-icon">⋮⋮</span>
        </div>

        {/* Icon */}
        <div className="item-icon">
          {typeof displayIcon === 'object' && displayIcon.type === 'svg'
            ? <img src={displayIcon.src} alt={displayIcon.alt} className="item-type-icon" />
            : <span className={`icon-${normalizedType}`}>{displayIcon}</span>}
        </div>

        {/* Item info */}
        <div className="item-info">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleSaveEdit}
              className="item-edit-input"
              autoFocus
            />
          ) : (
            <>
              <h4 className="item-title">
                <HighlightText text={item.name} highlight={searchTerm} />
              </h4>

              {/* Show URL if it's a link */}
              {normalizedType === 'link' && item.url && (
                <div className="item-link-container">
                  <a
                    href={item.url}
                    className="item-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HighlightText text={item.url} highlight={searchTerm} />
                  </a>
                </div>
              )}

              {/* Show file details if it's a file */}
              {normalizedType === 'file' && item.fileName && (
                <p className="item-details clickable" onClick={handleFileClick}>
                  <HighlightText text={`${item.fileName} (${formatFileSize(item.fileSize)})`} highlight={searchTerm} />
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Options menu */}
      <div className="item-actions">
        <button className="item-options" onClick={toggleOptions}>
          <span className="options-icon">⋮</span>
        </button>
        {isOptionsOpen && (
          <div className="item-options-menu" onClick={(e) => e.stopPropagation()}>
            <button className="option-item" onClick={handleEdit}>
              ✏️ {normalizedType === 'link' ? 'Edit link' : normalizedType === 'file' ? 'Edit file' : 'Rename'}
            </button>
            {isFileDownloadable() && <button className="option-item" onClick={handleDownload}>⬇️ Download</button>}
            <button className="option-item delete" onClick={handleDelete}>🗑️ Delete</button>
          </div>
        )}
      </div>

      {/* File preview overlay */}
      {isPreviewOpen && (
        <div className="file-preview-overlay" onClick={closePreview}>
          <div className="file-preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="file-preview-header">
              <h3>{item.fileName}</h3>
              <button className="file-preview-close" onClick={closePreview}>×</button>
            </div>
            <div className="file-preview-body">
              <img src={item.fileUrl} alt={item.fileName} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              {isFileDownloadable() && (
                <div className="file-preview-actions">
                  <button className="download-btn" onClick={handleDownload}>⬇️ Download</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {isContextMenuOpen && (
        <div className="context-menu" style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }} ref={itemRef}>
          <button className="context-menu-item" onClick={() => { handleFileClick(); closeContextMenu(); }}>👁️ Open/Preview</button>
          {isFileDownloadable() && <button className="context-menu-item" onClick={() => { handleDownload(); closeContextMenu(); }}>⬇️ Download</button>}
          <button className="context-menu-item" onClick={() => { handleEdit(); closeContextMenu(); }}>✏️ Edit file</button>
          <button className="context-menu-item delete" onClick={() => { handleDelete(); closeContextMenu(); }}>🗑️ Delete</button>
        </div>
      )}
    </div>
  );
};

export default ModuleItem;

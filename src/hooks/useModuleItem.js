import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import LinkColoredIcon from '../assets/LinkColored.svg';
import PDFColoredIcon from '../assets/PDFColored.svg';
import UploadOutlinedIcon from '../assets/UploadOutlined.svg';

export const useModuleItem = (item, onDelete, onEdit) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.name || '');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);

  const itemIcon = useMemo(() => {
    if (!item) {
      console.warn('No item data provided to useModuleItem');
      return '📎';
    }
    
    if (item.type === 'link') {
      return {
        type: 'svg',
        src: LinkColoredIcon,
        alt: 'Link icon'
      };
    }
    
    if (item.type === 'file') {
      if (!item.fileName) {
        return {
          type: 'svg',
          src: UploadOutlinedIcon,
          alt: 'File icon'
        };
      }
      
      const extension = item.fileName.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf') {
        return {
          type: 'svg',
          src: PDFColoredIcon,
          alt: 'PDF icon'
        };
      }
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
        return '🖼️';
      }
      
      if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(extension)) {
        return '🎥';
      }
      
      if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(extension)) {
        return '🎵';
      }
      
      return {
        type: 'svg',
        src: UploadOutlinedIcon,
        alt: 'File icon'
      };
    }
    
    return '📎';
  }, [item?.type, item?.fileName, item?.url]);

  const isFileDownloadable = useCallback(() => item.type === 'file' && item.fileUrl, [item.type, item.fileUrl]);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }, []);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(item.id);
  }, [onDelete, item.id]);

  const handleEdit = useCallback(() => {
    if (item.type === 'link' || item.type === 'file') {
      onEdit(item.id);
    } else {
      setIsEditing(true);
    }
    setIsOptionsOpen(false);
  }, [item.type, item.id, onEdit]);

  const handleSaveEdit = useCallback(() => {
    if (editValue.trim()) {
      onEdit(item.id, { ...item, name: editValue.trim() });
    }
    setIsEditing(false);
  }, [editValue, item, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setEditValue(item.name || '');
    setIsEditing(false);
  }, [item.name]);

  const handleDownload = useCallback(() => {
    if (!isFileDownloadable()) return;
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.download = item.fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOptionsOpen(false);
    setIsContextMenuOpen(false);
  }, [item.fileUrl, item.fileName, isFileDownloadable]);

  const handleFileClick = useCallback(() => {
    if (item.type !== 'file' || !item.fileUrl) return;
    const extension = item.fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      setIsPreviewOpen(true);
    } else {
      window.open(item.fileUrl, '_blank');
    }
  }, [item.type, item.fileUrl, item.fileName]);

  const handleContextMenu = useCallback((e) => {
    if (item.type === 'file') {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setIsContextMenuOpen(true);
    }
  }, [item.type]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleSaveEdit();
    else if (e.key === 'Escape') handleCancelEdit();
  }, [handleSaveEdit, handleCancelEdit]);

  const toggleOptions = useCallback((e) => {
    e.stopPropagation();
    setIsOptionsOpen(prev => !prev);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsOptionsOpen(false);
    setIsContextMenuOpen(false);
    setIsPreviewOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemRef.current && !itemRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeAllMenus();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAllMenus]);

  useEffect(() => {
    setEditValue(item.name || '');
  }, [item.name]);

  return {
    isEditing, editValue, isOptionsOpen, isPreviewOpen, isContextMenuOpen, contextMenuPosition,
    itemRef, itemIcon, handleDelete, handleEdit, handleSaveEdit, handleCancelEdit,
    handleDownload, handleFileClick, handleContextMenu, handleKeyPress, toggleOptions,
    closePreview: closeAllMenus, closeContextMenu: closeAllMenus, isFileDownloadable, formatFileSize, setEditValue,
  };
};

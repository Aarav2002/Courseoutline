import { useState, useEffect, useCallback } from 'react';
import { useCourseBuilderContext } from '../contexts/CourseBuilderContext';
import { dataUtils } from '../utils/dataStructures';

/**
 * Custom hook for UploadModal functionality
 * Demonstrates modularity by extracting UploadModal logic into reusable hook
 */
export const useUploadModal = (isOpen, onClose, onSave, moduleId, currentItem) => {
  const [fileTitle, setFileTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { items } = useCourseBuilderContext();

  useEffect(() => {
    if (isOpen) {
      if (currentItem) {
        setFileTitle(currentItem.name || '');
        setSelectedFile(null); 
      } else {
        setFileTitle('');
        setSelectedFile(null);
      }
    }
  }, [isOpen, currentItem]);

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!fileTitle.trim()) {
      return; 
    }

    if (!currentItem && !selectedFile) {
      return; 
    }

    if (dataUtils.checkDuplicateItemInModule(items, moduleId, fileTitle.trim(), currentItem?.id)) {
      return; 
    }

    if (currentItem) {
      
      let updatedItem = {
        ...currentItem,
        name: fileTitle.trim(),
        title: fileTitle.trim(),
      };

      if (selectedFile) {
        const fileUrl = URL.createObjectURL(selectedFile);
        updatedItem = {
          ...updatedItem,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          fileUrl: fileUrl,
        };
      }

      onSave(currentItem.id, updatedItem);
    } else {
      const fileUrl = URL.createObjectURL(selectedFile);

      onSave({
        id: Date.now().toString(),
        moduleId,
        type: 'file',
        name: fileTitle.trim(),
        title: fileTitle.trim(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        fileUrl: fileUrl,
      });
    }
    
    setFileTitle('');
    setSelectedFile(null);
    onClose();
  }, [fileTitle, selectedFile, moduleId, items, currentItem, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setFileTitle('');
    setSelectedFile(null);
    onClose();
  }, [onClose]);

  const handleTitleChange = useCallback((e) => {
    setFileTitle(e.target.value);
  }, []);

  const hasDuplicateTitle = fileTitle.trim() !== '' && 
    dataUtils.checkDuplicateItemInModule(items, moduleId, fileTitle.trim(), currentItem?.id);

  const isFormValid = fileTitle.trim().length > 0 && 
    (currentItem || selectedFile !== null) && 
    !hasDuplicateTitle;


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileExtension = () => {
    if (!selectedFile) return '';
    return selectedFile.name.split('.').pop()?.toLowerCase() || '';
  };

  const isFileTypeSupported = () => {
    if (!selectedFile) return true;
    const extension = getFileExtension();
    const supportedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'mp3', 'wav'];
    return supportedTypes.includes(extension);
  };

  return {
    // State
    fileTitle,
    selectedFile,
    
    // Actions
    handleSubmit,
    handleCancel,
    handleFileChange,
    handleTitleChange,
    
    // Computed values
    isFormValid,
    isFileTypeSupported: isFileTypeSupported(),
    
    // Utility functions
    formatFileSize,
    getFileExtension,
    
    // Form validation
    titleError: hasDuplicateTitle ? 'A file with this title already exists in this module' : '',
    fileError: selectedFile && !isFileTypeSupported() ? 'File type not supported' : '',
  };
};

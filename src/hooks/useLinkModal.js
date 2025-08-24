import { useState, useEffect, useCallback } from 'react';
import { useCourseBuilderContext } from '../contexts/CourseBuilderContext';
import { dataUtils } from '../utils/dataStructures';

/**
 * Custom hook for LinkModal functionality
 * Demonstrates modularity by extracting LinkModal logic into reusable hook
 */
export const useLinkModal = (isOpen, onClose, onSave, moduleId, currentItem) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const { items } = useCourseBuilderContext();

  useEffect(() => {
    if (isOpen) {
      if (currentItem) {
        setLinkTitle(currentItem.name || '');
        setLinkUrl(currentItem.url || '');
      } else {
        setLinkTitle('');
        setLinkUrl('');
      }
    }
  }, [isOpen, currentItem]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!linkTitle.trim() || !linkUrl.trim()) {
      return; 
    }

    if (dataUtils.checkDuplicateItemInModule(items, moduleId, linkTitle.trim(), currentItem?.id)) {
      return; 
    }

    if (currentItem) {
      onSave(currentItem.id, {
        ...currentItem,
        name: linkTitle.trim(),
        title: linkTitle.trim(),
        url: linkUrl.trim(),
      });
    } else {
      onSave({
        id: Date.now().toString(),
        moduleId,
        type: 'link',
        name: linkTitle.trim(),
        title: linkTitle.trim(),
        url: linkUrl.trim(),
      });
    }
    
    setLinkTitle('');
    setLinkUrl('');
    onClose();
  }, [linkTitle, linkUrl, moduleId, items, currentItem, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setLinkTitle('');
    setLinkUrl('');
    onClose();
  }, [onClose]);

  const handleTitleChange = useCallback((e) => {
    setLinkTitle(e.target.value);
  }, []);

  const handleUrlChange = useCallback((e) => {
    setLinkUrl(e.target.value);
  }, []);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isUrlValid = linkUrl.trim() === '' || isValidUrl(linkUrl.trim());
  
  const hasDuplicateTitle = linkTitle.trim() !== '' && 
    dataUtils.checkDuplicateItemInModule(items, moduleId, linkTitle.trim(), currentItem?.id);
  
  const isFormValid = linkTitle.trim().length > 0 && 
    linkUrl.trim().length > 0 && 
    isUrlValid && 
    !hasDuplicateTitle;

  return {
    linkTitle,
    linkUrl,
    
    handleSubmit,
    handleCancel,
    handleTitleChange,
    handleUrlChange,
    
    isFormValid,
    isUrlValid,
    
    titleError: hasDuplicateTitle ? 'A link with this title already exists in this module' : '',
    urlError: linkUrl.trim() !== '' && !isUrlValid ? 'Please enter a valid URL' : '',
  };
};

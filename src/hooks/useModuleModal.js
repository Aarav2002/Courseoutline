import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for ModuleModal functionality
 * Demonstrates modularity by extracting ModuleModal logic into reusable hook
 */
export const useModuleModal = (isOpen, onClose, onSave, module = null) => {
  const [moduleName, setModuleName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setModuleName(module ? module.name : '');
      setErrorMessage('');
    } else {
      setModuleName('');
      setErrorMessage('');
    }
  }, [isOpen, module]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!moduleName.trim()) {
      return; 
    }

    setErrorMessage('');

    const result = onSave({
      id: module ? module.id : Date.now().toString(),
      name: moduleName.trim(),
    });
    
    if (result && result.error) {
      setErrorMessage(result.error);
      return; 
    }
    
    setModuleName('');
    setErrorMessage('');
    onClose();
  }, [moduleName, module, onSave, onClose]);

  const handleCancel = useCallback(() => {
    setModuleName('');
    setErrorMessage('');
    onClose();
  }, [onClose]);

  const handleInputChange = useCallback((e) => {
    setModuleName(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  const isFormValid = moduleName.trim().length > 0;

  return {
   
    moduleName,
    errorMessage,
    

    handleSubmit,
    handleCancel,
    handleInputChange,
    

    isFormValid,
    
  
    isEditMode: !!module,
    modalTitle: module ? 'Edit module' : 'Create new module',
    submitButtonText: module ? 'Save changes' : 'Create',
  };
};

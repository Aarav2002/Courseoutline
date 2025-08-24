import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export const useModuleCard = (module, items, searchTerm, onEdit, onDelete, onAddItem) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const cardRef = useRef(null);

  const moduleItems = useMemo(() => {
    return items.filter(item => item.moduleId === module.id);
  }, [items, module.id]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return moduleItems;
    
    return moduleItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [moduleItems, searchTerm]);

  const shouldAutoExpand = useMemo(() => {
    return searchTerm && filteredItems.length > 0 && filteredItems.length < moduleItems.length;
  }, [searchTerm, filteredItems.length, moduleItems.length]);

  const displayExpanded = isExpanded || shouldAutoExpand;

  const toggleOptions = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOptionsOpen(!isOptionsOpen);
  }, [isOptionsOpen]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const toggleAddMenu = useCallback((e) => {
    e.stopPropagation();
    setIsAddMenuOpen(!isAddMenuOpen);
  }, [isAddMenuOpen]);

  const handleEdit = useCallback(() => {
    onEdit(module);
    setIsOptionsOpen(false);
  }, [onEdit, module]);

  const handleDelete = useCallback(() => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  }, [onDelete, module.id]);

  const handleAddClick = useCallback((type) => {
    onAddItem(module.id, type);
    setIsAddMenuOpen(false);
  }, [onAddItem, module.id]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!isAddMenuOpen) return;
      const target = event.target;
      if (!cardRef.current) return;

      const container = target.closest('.add-item-container');
      if (!container || !cardRef.current.contains(container)) {
        setIsAddMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAddMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddMenuOpen]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!isOptionsOpen) return;
      
      if (event.target.closest('.btn-options')) {
        return;
      }
      
      if (event.target.closest('.options-menu')) {
        return;
      }
      
      setIsOptionsOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOptionsOpen(false);
      }
    };

    if (isOptionsOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOptionsOpen]);

  useEffect(() => {
    setIsOptionsOpen(false);
    setIsAddMenuOpen(false);
  }, [searchTerm]);

  return {
    isOptionsOpen,
    isExpanded,
    isAddMenuOpen,
    displayExpanded,
    cardRef,
    moduleItems,
    filteredItems,
    shouldAutoExpand,
    toggleOptions,
    toggleExpanded,
    toggleAddMenu,
    handleEdit,
    handleDelete,
    handleAddClick,
  };
};

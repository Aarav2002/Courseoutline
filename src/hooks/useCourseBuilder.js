import { useState, useRef, useEffect, useCallback } from 'react';
import { dataUtils, ModuleSearchTree, ItemHashMap, OperationQueue } from '../utils/dataStructures';
import { STORAGE_KEYS } from '../constants';
export const useCourseBuilder = () => {
  const getInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COURSE_BUILDER_STATE);
      if (!raw) return { modules: [], items: [] };

      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.modules) && Array.isArray(parsed.items)) {
        return { modules: parsed.modules, items: parsed.items };
      }
    } catch (error) {
      console.warn('Failed to load persisted state:', error);
    }
    return { modules: [], items: [] };
  };

  const initialState = getInitialState();

  const [modules, setModules] = useState(initialState.modules);
  const [items, setItems] = useState(initialState.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModules, setFilteredModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null); // For editing existing items
  const moduleRefs = useRef({});
  const searchTree = useRef(new ModuleSearchTree());
  const itemHashMap = useRef(new ItemHashMap());
  const operationQueue = useRef(new OperationQueue());

  useEffect(() => {
    modules.forEach(module => searchTree.current.insert(module));
    items.forEach(item => itemHashMap.current.addItem(item.moduleId, item));
  }, []);

  useEffect(() => {
    if (modules.length === 0 && items.length === 0) {
      const stored = localStorage.getItem(STORAGE_KEYS.COURSE_BUILDER_STATE);
      if (stored && stored !== '{"modules":[],"items":[]}') {
        return;
      }
    }

    try {
      const payload = JSON.stringify({ modules, items });
      localStorage.setItem(STORAGE_KEYS.COURSE_BUILDER_STATE, payload);
      console.log('State persisted to localStorage:', {
        modules: modules.length,
        items: items.length,
      });
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }, [modules, items]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModules(modules);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = [];

    modules.forEach(module => {
      const moduleMatches = module.name.toLowerCase().includes(searchLower);
      const moduleItems = itemHashMap.current.get(module.id);
      const matchingItems = moduleItems.filter(
        item =>
          item.name.toLowerCase().includes(searchLower) ||
          (item.url && item.url.toLowerCase().includes(searchLower))
      );

      if (moduleMatches || matchingItems.length > 0) {
        filtered.push(module);
      }
    });

    setFilteredModules(filtered);
  }, [searchTerm, modules]);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isNavigating) return;

        const scrollPosition = window.scrollY + 150;
        const windowHeight = window.innerHeight;
        let currentActive = null;

        for (let i = 0; i < modules.length; i++) {
          const module = modules[i];
          const element = moduleRefs.current[module.id];
          if (element) {
            const { offsetTop, offsetHeight } = element;
            const elementBottom = offsetTop + offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < elementBottom) {
              const visibleTop = Math.max(scrollPosition, offsetTop);
              const visibleBottom = Math.min(scrollPosition + windowHeight, elementBottom);
              const visibleHeight = visibleBottom - visibleTop;

              if (visibleHeight > offsetHeight * 0.3) {
                currentActive = module.id;
                break;
              }
            }
          }
        }

        if (currentActive !== activeModuleId && currentActive !== null) {
          setActiveModuleId(currentActive);
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [modules, activeModuleId, isNavigating]);

  useEffect(() => {
    if (!activeModuleId && modules.length > 0) {
      setActiveModuleId(modules[0].id);
    }
  }, [modules, activeModuleId]);

  const handleSaveModule = useCallback(
    module => {
      // Check for duplicate module names
      const isDuplicate = modules.some(existingModule => 
        existingModule.id !== module.id && 
        existingModule.name.trim().toLowerCase() === module.name.trim().toLowerCase()
      );
      
      if (isDuplicate) {
        console.error('Module validation failed: Duplicate module name');
        // Return error object to indicate failure
        return { error: 'A module with this name already exists. Please choose a different name.' };
      }

      const validation = dataUtils.validateModule(module);
      if (!validation.isValid) {
        console.error('Module validation failed:', validation.errors);
        return { error: validation.errors.join(', ') };
      }

      const operation = {
        type: 'SAVE_MODULE',
        data: { module, isEdit: !!currentModule },
        timestamp: Date.now(),
      };

      if (currentModule) {
        setModules(prevModules => {
          const updated = prevModules.map(m => m.id === module.id ? module : m);
          searchTree.current = new ModuleSearchTree();
          updated.forEach(m => searchTree.current.insert(m));
          return updated;
        });
      } else {
        const moduleWithTimestamp = { ...module, createdAt: Date.now() };
        setModules(prevModules => {
          const updated = [...prevModules, moduleWithTimestamp];
          searchTree.current.insert(moduleWithTimestamp);
          return updated;
        });
      }

      operationQueue.current.push(operation);
      setIsModuleModalOpen(false);
      setCurrentModule(null);
      
      // Return success
      return { success: true };
    },
    [currentModule, modules]
  );

  const handleEditModule = useCallback(module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  }, []);

  const handleDeleteModule = useCallback(
    moduleId => {
      const operation = {
        type: 'DELETE_MODULE',
        data: {
          moduleId,
          module: modules.find(m => m.id === moduleId),
          items: items.filter(item => item.moduleId === moduleId),
        },
        timestamp: Date.now(),
      };

      setModules(prevModules => {
        const updated = prevModules.filter(module => module.id !== moduleId);
        searchTree.current = new ModuleSearchTree();
        updated.forEach(m => searchTree.current.insert(m));
        return updated;
      });

      setItems(prevItems =>
        prevItems.filter(item => item.moduleId !== moduleId)
      );
      itemHashMap.current.set(moduleId, []);

      operationQueue.current.push(operation);
    },
    [modules, items]
  );

  const handleEditItem = useCallback(
    (itemId, updatedItem) => {
      // If updatedItem is passed, this is a direct update (from inline editing)
      if (updatedItem) {
        const validation = dataUtils.validateItem(updatedItem);
        if (!validation.isValid) {
          console.error('Item validation failed:', validation.errors);
          return;
        }

        const operation = {
          type: 'EDIT_ITEM',
          data: { itemId, updatedItem },
          timestamp: Date.now(),
        };

        setItems(prevItems =>
          prevItems.map(item => (item.id === itemId ? updatedItem : item))
        );

        const oldItem = items.find(i => i.id === itemId);
        if (oldItem) {
          itemHashMap.current.removeItem(oldItem.moduleId, itemId);
        }
        itemHashMap.current.addItem(updatedItem.moduleId, updatedItem);

        operationQueue.current.push(operation);
      } else {
        // If no updatedItem, this is opening edit modal
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        
        setCurrentItem(item);
        setCurrentModuleId(item.moduleId);
        
        if (item.type === 'link') {
          setIsLinkModalOpen(true);
        } else if (item.type === 'file') {
          setIsUploadModalOpen(true);
        }
      }
    },
    [items]
  );

  const handleSaveLink = useCallback(
    (itemIdOrData, updatedData) => {
      if (typeof itemIdOrData === 'string') {
        // Editing existing link - itemIdOrData is the itemId, updatedData is the new data
        handleEditItem(itemIdOrData, updatedData);
      } else {
        // Creating new link - itemIdOrData is the new link data
        const linkItem = itemIdOrData;
        const validation = dataUtils.validateItem(linkItem);
        if (!validation.isValid) {
          console.error('Link item validation failed:', validation.errors);
          return;
        }

        const operation = {
          type: 'ADD_LINK',
          data: { linkItem },
          timestamp: Date.now(),
        };

        const itemWithTimestamp = {
          ...linkItem,
          moduleId: currentModuleId,
          createdAt: Date.now()
        };

        setItems(prevItems => [...prevItems, itemWithTimestamp]);
        itemHashMap.current.addItem(currentModuleId, itemWithTimestamp);

        operationQueue.current.push(operation);
      }
      
      setIsLinkModalOpen(false);
      setCurrentModuleId(null);
      setCurrentItem(null);
    },
    [currentModuleId, handleEditItem]
  );

  const handleSaveUpload = useCallback(
    (itemIdOrData, updatedData) => {
      if (typeof itemIdOrData === 'string') {
        // Editing existing file - itemIdOrData is the itemId, updatedData is the new data
        handleEditItem(itemIdOrData, updatedData);
      } else {
        // Creating new file - itemIdOrData is the new file data
        const fileItem = itemIdOrData;
        const validation = dataUtils.validateItem(fileItem);
        if (!validation.isValid) {
          console.error('File item validation failed:', validation.errors);
          return;
        }

        const operation = {
          type: 'ADD_FILE',
          data: { fileItem },
          timestamp: Date.now(),
        };

        const itemWithTimestamp = {
          ...fileItem,
          moduleId: currentModuleId,
          createdAt: Date.now()
        };

        setItems(prevItems => [...prevItems, itemWithTimestamp]);
        itemHashMap.current.addItem(currentModuleId, itemWithTimestamp);

        operationQueue.current.push(operation);
      }
      
      setIsUploadModalOpen(false);
      setCurrentModuleId(null);
      setCurrentItem(null);
    },
    [currentModuleId, handleEditItem]
  );

  const handleDeleteItem = useCallback(
    itemId => {
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const operation = {
        type: 'DELETE_ITEM',
        data: { itemId, item },
        timestamp: Date.now(),
      };

      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      itemHashMap.current.removeItem(item.moduleId, itemId);

      operationQueue.current.push(operation);
    },
    [items]
  );

  const scrollToModule = useCallback(moduleId => {
    setIsNavigating(true);
    const element = moduleRefs.current[moduleId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveModuleId(moduleId);
      setTimeout(() => { setIsNavigating(false); }, 1000);
    }
  }, []);

  const handleAddClick = useCallback(type => {
    if (type === 'module') {
      setCurrentModule(null);
      setIsModuleModalOpen(true);
    }
  }, []);

  const handleAddItem = useCallback((moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  }, []);

  const handleCloseModuleModal = useCallback(() => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  }, []);

  const handleCloseLinkModal = useCallback(() => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
    setCurrentItem(null); // Clear current item when closing
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
    setCurrentItem(null); // Clear current item when closing
  }, []);

  const undo = useCallback(() => {
    const operation = operationQueue.current.undo();
    if (operation) {
      console.log('Undoing operation:', operation);
    }
  }, []);

  const redo = useCallback(() => {
    const operation = operationQueue.current.redo();
    if (operation) {
      console.log('Redoing operation:', operation);
    }
  }, []);

  const getModuleItems = useCallback(moduleId => {
    return itemHashMap.current.get(moduleId);
  }, []);

  const getItemCount = useCallback(moduleId => {
    return itemHashMap.current.getItemCount(moduleId);
  }, []);

  const canUndo = useCallback(() => {
    return operationQueue.current.canUndo();
  }, []);

  const canRedo = useCallback(() => {
    return operationQueue.current.canRedo();
  }, []);

  const handleCreateModuleRoot = useCallback(() => {
    setCurrentModule(null);
    setIsModuleModalOpen(true);
    setCurrentModuleId(null);
  }, []);

  const handleAddLinkRoot = useCallback(() => {
    setIsLinkModalOpen(true);
    setCurrentModuleId(null);
  }, []);

  const handleUploadRoot = useCallback(() => {
    setIsUploadModalOpen(true);
    setCurrentModuleId(null);
  }, []);

  const getOrderedContent = useCallback(() => {
    const rootItems = items.filter(item => !item.moduleId);
    
    // Create ordered content while preserving array positions
    // Modules maintain their drag-and-drop order, root items follow after
    const orderedContent = [];
    
    // Add modules in their current order (preserves drag-and-drop sequence)
    modules.forEach(module => {
      orderedContent.push({ ...module, type: 'module' });
    });
    
    // Add root items after modules (or at the beginning if no modules)
    rootItems.forEach(item => {
      orderedContent.push({ ...item, type: 'item' });
    });
    
    return orderedContent;
  }, [modules, items]);

  return {
    modules,
    items,
    searchTerm,
    filteredModules,
    activeModuleId,
    isNavigating,
    isModuleModalOpen,
    isLinkModalOpen,
    isUploadModalOpen,
    currentModule,
    currentModuleId,
    currentItem,
    moduleRefs,
    setSearchTerm,
    setModules,
    setItems,
    handleSaveModule,
    handleEditModule,
    handleDeleteModule,
    handleSaveLink,
    handleSaveUpload,
    handleDeleteItem,
    handleEditItem,
    handleAddClick,
    handleAddItem,
    scrollToModule,
    handleCloseModuleModal,
    handleCloseLinkModal,
    handleCloseUploadModal,
    getModuleItems,
    getItemCount,
    getOrderedContent,
    undo,
    redo,
    canUndo,
    canRedo,
    handleCreateModuleRoot,
    handleAddLinkRoot,
    handleUploadRoot,
  };
};
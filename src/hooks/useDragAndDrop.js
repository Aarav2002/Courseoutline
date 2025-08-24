import { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { dataUtils } from '../utils/dataStructures';

export const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const customCollisionDetection = useCallback((args) => {
    const collisions = closestCenter(args);
    
    return collisions.filter(collision => {
      const { id } = collision;
      const activeId = args.active.id;
      
      if (id === activeId) return false;
      
      if (activeId.startsWith('module-')) {
        return id.startsWith('module-');
      }
      
      if (activeId.startsWith('item-')) {
        return id.startsWith('item-') || id.startsWith('module-') || id === 'root-drop-zone';
      }
      
      return true;
    });
  }, []);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setDraggedItem(active.id);
    setDragOverItem(null);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      setDragOverItem(null);
      return;
    }

    const newDragOverItem = active.id.startsWith('item-') ? over.id : null;
    setDragOverItem(prevItem => prevItem !== newDragOverItem ? newDragOverItem : prevItem);
  }, []);

  const handleDragEnd = useCallback((event, modules, items, setModules, setItems) => {
    const { active, over } = event;

    setDraggedItem(null);
    setDragOverItem(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId.startsWith('module-') && overId.startsWith('module-')) {
      const activeIndex = modules.findIndex(m => `module-${m.id}` === activeId);
      const overIndex = modules.findIndex(m => `module-${m.id}` === overId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        setModules(prevModules => arrayMove(prevModules, activeIndex, overIndex));
      }
      return;
    }

    if (activeId.startsWith('item-')) {
      const activeItem = items.find(item => `item-${item.id}` === activeId);
      if (!activeItem) return;

      let targetModuleId;
      let targetIndex;

      if (overId.startsWith('item-')) {
        const overItem = items.find(item => `item-${item.id}` === overId);
        if (!overItem) return;
        targetModuleId = overItem.moduleId;
        const moduleItems = items.filter(item => item.moduleId === targetModuleId);
        targetIndex = moduleItems.findIndex(item => `item-${item.id}` === overId);
      } else if (overId.startsWith('module-')) {
        targetModuleId = overId.replace('module-', '');
        targetIndex = items.filter(item => item.moduleId === targetModuleId).length;
      } else if (overId === 'root-drop-zone') {
        targetModuleId = null;
        targetIndex = items.filter(item => !item.moduleId).length;
      } else {
        return;
      }

      if (!dataUtils.canMoveItemToModule(items, activeItem.id, targetModuleId)) {
        console.warn('Cannot move item: duplicate name exists in target module');
        return;
      }

      setItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.id === activeItem.id ? { ...item, moduleId: targetModuleId } : item
        );

        const moduleItems = updatedItems.filter(item => item.moduleId === targetModuleId);
        const otherItems = updatedItems.filter(item => item.moduleId !== targetModuleId);
        
        const currentIndex = moduleItems.findIndex(item => item.id === activeItem.id);
        if (currentIndex !== -1 && targetIndex !== -1 && currentIndex !== targetIndex) {
          const reorderedModuleItems = arrayMove(moduleItems, currentIndex, targetIndex);
          return [...otherItems, ...reorderedModuleItems];
        }
        
        return updatedItems;
      });
    }
  }, []);

  const createSortableItems = useCallback((items, prefix = '') => {
    return items.map(item => `${prefix}${item.id}`);
  }, []);

  const getDndContextProps = useCallback((modules, items, setModules, setItems) => ({
    sensors,
    collisionDetection: customCollisionDetection,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: (event) => handleDragEnd(event, modules, items, setModules, setItems),
  }), [sensors, customCollisionDetection, handleDragStart, handleDragOver, handleDragEnd]);

  const getSortableContextProps = useCallback((items, strategy = verticalListSortingStrategy) => ({
    items,
    strategy,
  }), []);

  return {
    draggedItem,
    dragOverItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    createSortableItems,
    getDndContextProps,
    getSortableContextProps,
    verticalListSortingStrategy,
  };
};
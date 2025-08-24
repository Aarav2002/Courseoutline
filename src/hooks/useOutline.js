import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for outline functionality
 * Demonstrates modularity by extracting outline logic into reusable hook
 */
export const useOutline = (modules, items, activeModuleId, searchTerm) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const getModuleItemCount = useCallback((moduleId) => {
    return items.filter(item => item.moduleId === moduleId).length;
  }, [items]);

  const filteredModules = useMemo(() => {
    if (!searchTerm) return modules;
    
    return modules.filter(module => {
      const moduleMatches = module.name.toLowerCase().includes(searchTerm.toLowerCase());
      const moduleItems = items.filter(item => item.moduleId === module.id);
      const itemMatches = moduleItems.some(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      return moduleMatches || itemMatches;
    });
  }, [modules, items, searchTerm]);

  const moduleStats = useMemo(() => {
    const totalModules = filteredModules.length;
    const totalItems = filteredModules.reduce((sum, module) => 
      sum + getModuleItemCount(module.id), 0
    );
    
    return {
      totalModules,
      totalItems,
      hasResults: totalModules > 0,
      isSearching: !!searchTerm,
    };
  }, [filteredModules, getModuleItemCount, searchTerm]);

  const shouldShowOutline = useMemo(() => {
    return modules.length > 0;
  }, [modules.length]);

  const activeModuleInfo = useMemo(() => {
    if (!activeModuleId) return null;
    
    const module = modules.find(m => m.id === activeModuleId);
    if (!module) return null;
    
    return {
      ...module,
      itemCount: getModuleItemCount(module.id),
      index: modules.findIndex(m => m.id === activeModuleId),
    };
  }, [activeModuleId, modules, getModuleItemCount]);

  return {
    isCollapsed,
    
    filteredModules,
    moduleStats,
    shouldShowOutline,
    activeModuleInfo,
    
    toggleCollapse,
    getModuleItemCount,
  };
};

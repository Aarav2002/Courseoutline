import { useState, useRef, useEffect, useCallback } from 'react';

export const useHeader = (onAddClick, onSearchChange) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddClick = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen);
  }, [isDropdownOpen]);

  const handleCreateModule = useCallback(() => {
    onAddClick('module');
    setIsDropdownOpen(false);
  }, [onAddClick]);

  const handleAddLink = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleUpload = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleSearchChange = useCallback(
    e => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const clearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleAddLinkRoot = useCallback(() => {
    onAddClick('link');
    setIsDropdownOpen(false);
  }, [onAddClick]);

  const handleUploadRoot = useCallback(() => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  }, [onAddClick]);

  return {
    isDropdownOpen,
    dropdownRef,
    handleAddClick,
    handleCreateModule,
    handleAddLink,
    handleAddLinkRoot,
    handleUpload,
    handleUploadRoot,
    handleSearchChange,
    clearSearch,
    closeDropdown,
  };
};

import React from 'react';
import { useHeader } from '../../hooks/useHeader';

const Header = ({ onAddClick, searchTerm, onSearchChange }) => {
  const {
    isDropdownOpen,
    dropdownRef,
    handleAddClick,
    handleCreateModule,
    handleAddLinkRoot,
    handleUploadRoot,
    handleSearchChange,
    clearSearch,
  } = useHeader(onAddClick, onSearchChange);

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search modules and resources..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch}>
              ×
            </button>
          )}
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            <span className="add-icon">+</span>
            Add
            <span className="dropdown-arrow">▼</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">📄</span>
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLinkRoot}>
                <span className="item-icon">🔗</span>
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUploadRoot}>
                <span className="item-icon">⬆️</span>
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

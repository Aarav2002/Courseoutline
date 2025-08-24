import React from 'react';
import { useOutline } from '../../hooks/useOutline';

const Outline = ({ modules, items, activeModuleId, onModuleClick, searchTerm }) => {
  const {
    isCollapsed,
    filteredModules,
    moduleStats,
    shouldShowOutline,
    toggleCollapse,
    getModuleItemCount,
  } = useOutline(modules, items, activeModuleId, searchTerm);

  if (!shouldShowOutline) return null;

  return (
    <div className={`outline ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="outline-header">
        <button className="outline-toggle" onClick={toggleCollapse}>
          <span className={`outline-toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>
            ◀
          </span>
        </button>
        {!isCollapsed && (
          <>
            <h3 className="outline-title">Course Outline</h3>
            <div className="outline-stats">
              {moduleStats.totalModules} module{moduleStats.totalModules !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="outline-content">
          {moduleStats.isSearching && (
            <div className="outline-search-info">
              <span className="search-results-text">
                Showing results for "{searchTerm}"
              </span>
            </div>
          )}
          
          <div className="outline-modules">
            {filteredModules.map((module, index) => {
              const itemCount = getModuleItemCount(module.id);
              const isActive = activeModuleId === module.id;
              
              return (
                <div
                  key={module.id}
                  className={`outline-module ${isActive ? 'active' : ''}`}
                  onClick={() => onModuleClick(module.id)}
                >
                  <div className="outline-module-content">
                    <div className="outline-module-number">
                      {index + 1}
                    </div>
                    <div className="outline-module-info">
                      <div className="outline-module-name">
                        {module.name}
                      </div>
                      <div className="outline-module-count">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {isActive && <div className="outline-active-indicator" />}
                </div>
              );
            })}
          </div>
          
          {!moduleStats.hasResults && moduleStats.isSearching && (
            <div className="outline-no-results">
              <div className="outline-no-results-icon">🔍</div>
              <div className="outline-no-results-text">
                No modules match your search
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Outline;
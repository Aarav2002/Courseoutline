import React, { forwardRef } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ModuleItem from './ModuleItem';
import { useModuleCard } from '../../hooks/useModuleCard';

const HighlightText = ({ text, highlight }) => {
  if (!highlight) return text;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="search-highlight">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const ModuleCard = forwardRef(({
  module,
  onEdit,
  onDelete,
  items = [],
  onAddItem,
  onDeleteItem,
  onEditItem,
  searchTerm,
  draggedItem,
  dragOverItem,
}, ref) => {
  const {
    isOptionsOpen,
    isExpanded,
    isAddMenuOpen,
    displayExpanded,
    cardRef,
    moduleItems,
    filteredItems,
    toggleOptions,
    toggleExpanded,
    toggleAddMenu,
    handleEdit,
    handleDelete,
    handleAddClick,
  } = useModuleCard(module, items, searchTerm, onEdit, onDelete, onAddItem);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `module-${module.id}` });

  const isItemDraggedOver = dragOverItem === `module-${module.id}` && 
    draggedItem && 
    draggedItem.startsWith('item-') && 
    draggedItem !== `item-${module.id}`; // Prevent self-drag feedback

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
        if (ref) ref(node);
      }}
      style={style}
      className={`module-card-container ${isDragging ? 'dragging' : ''} ${isItemDraggedOver ? 'item-drag-over' : ''}`}
    >
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content">
          <div 
            className="module-drag-handle"
            {...attributes}
            {...listeners}
          >
            <span className="drag-icon">⋮⋮</span>
          </div>
          <div className="module-icon">
            <span className={`icon ${displayExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
          <div className="module-info">
            <h3 className="module-title">
              {searchTerm ? (
                <HighlightText text={module.name} highlight={searchTerm} />
              ) : (
                module.name
              )}
            </h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
              {searchTerm && filteredItems.length !== moduleItems.length && (
                <span className="search-match-count">
                  {' '}• {filteredItems.length} match{filteredItems.length !== 1 ? 'es' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            <span className="options-icon">⋮</span>
          </button>
          {isOptionsOpen && (
            <div className="options-menu" onClick={(e) => e.stopPropagation()}>
              <button className="option-item" onClick={handleEdit}>
                <span className="option-icon">✏️</span>
                Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <span className="option-icon">🗑️</span>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isItemDraggedOver && (
        <div className="module-drop-indicator">
          <div className="drop-indicator-content">
            Drop item here to add to "{module.name}"
          </div>
        </div>
      )}
      
      {displayExpanded && (
        <div className="module-content-expanded">
          {filteredItems.length === 0 && !searchTerm ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No content added to this module yet.
              </p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span className="add-icon">+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('link')}
                    >
                      <span className="item-icon">🔗</span>
                      Add a link
                    </button>
                    <button
                      className="add-item-option"
                      onClick={() => handleAddClick('file')}
                    >
                      <span className="item-icon">⬆️</span>
                      Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : filteredItems.length === 0 && searchTerm ? (
            <div className="empty-module-content">
              <p className="empty-module-message">
                No items match your search in this module.
              </p>
            </div>
          ) : (
            <div className="module-items">
              <SortableContext
                items={filteredItems.map(item => `item-${item.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="module-items-list">
                  {filteredItems.map(item => (
                    <ModuleItem
                      key={item.id}
                      item={item}
                      onDelete={onDeleteItem}
                      onEdit={onEditItem}
                      searchTerm={searchTerm}
                      draggedItem={draggedItem}
                      dragOverItem={dragOverItem}
                    />
                  ))}
                </div>
              </SortableContext>
              {!searchTerm && (
                <div className="add-item-container">
                  <button className="add-item-button" onClick={toggleAddMenu}>
                    <span className="add-icon">+</span> Add item
                  </button>
                  {isAddMenuOpen && (
                    <div className="add-item-menu">
                      <button
                        className="add-item-option"
                        onClick={() => handleAddClick('link')}
                      >
                        <span className="item-icon">🔗</span>
                        Add a link
                      </button>
                      <button
                        className="add-item-option"
                        onClick={() => handleAddClick('file')}
                      >
                        <span className="item-icon">⬆️</span>
                        Upload file
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});


ModuleCard.displayName = 'ModuleCard';

export default ModuleCard;
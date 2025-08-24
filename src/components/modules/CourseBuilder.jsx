import React, { useMemo } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';
import Outline from '../ui/Outline';
import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleItem from './ModuleItem';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import { useCourseBuilderContext } from '../../contexts/CourseBuilderContext';
const RootDropZone = ({ children, draggedItem, dragOverItem }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'root-drop-zone',
  });

  const isDraggedItemFromModule = draggedItem && draggedItem.startsWith('item-');
  const isDropZoneActive = isDraggedItemFromModule && (isOver || dragOverItem === 'root-drop-zone');

  return (
    <div 
      ref={setNodeRef}
      className={`root-drop-zone ${isDropZoneActive ? 'drop-zone-active' : ''}`}
      style={{
        minHeight: isDraggedItemFromModule ? '100px' : 'auto',
        border: isDropZoneActive ? '2px dashed #007bff' : 'none',
        borderRadius: '8px',
        padding: isDropZoneActive ? '20px' : '0',
        backgroundColor: isDropZoneActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {isDropZoneActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#007bff',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          Drop here to move to root level
        </div>
      )}
      {children}
    </div>
  );
};

const CourseBuilder = () => {
  const {
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
    handleAddLinkRoot,
    handleUploadRoot,
    getOrderedContent,
    draggedItem,
    dragOverItem,
    getDndContextProps,
    getSortableContextProps,
  } = useCourseBuilderContext();

  const displayModules = searchTerm ? filteredModules : modules;
  const rootItems = items.filter(item => !item.moduleId);
  const orderedContent = getOrderedContent();

  const handleHeaderAddClick = type => {
    if (type === 'module') {
      handleAddClick(type);
    } else if (type === 'link') {
      handleAddLinkRoot();
    } else if (type === 'upload') {
      handleUploadRoot();
    }
  };

  // Memoized sortable items for better performance
  const sortableItems = useMemo(() => {
    const moduleIds = displayModules.map(m => `module-${m.id}`);
    const rootItemIds = rootItems.map(item => `item-${item.id}`);
    return [...rootItemIds, ...moduleIds];
  }, [displayModules, rootItems]);

  // Memoized DnD context props to prevent unnecessary re-renders
  const dndContextProps = useMemo(() => 
    getDndContextProps(modules, items, setModules, setItems), 
    [getDndContextProps, modules, items, setModules, setItems]
  );

  // Memoized sortable context props
  const sortableContextProps = useMemo(() => 
    getSortableContextProps(sortableItems), 
    [getSortableContextProps, sortableItems]
  );

  return (
    <div className="course-builder">
      <Header
        onAddClick={handleHeaderAddClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="builder-layout">
        {modules.length > 0 && (
          <Outline
            modules={modules}
            items={items}
            activeModuleId={activeModuleId}
            onModuleClick={scrollToModule}
            searchTerm={searchTerm}
          />
        )}

        <div className="builder-content">
          {modules.length === 0 && rootItems.length === 0 ? (
            <EmptyState />
          ) : displayModules.length === 0 && searchTerm ? (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            </div>
          ) : (
            <DndContext
              {...dndContextProps}
            >
              <RootDropZone draggedItem={draggedItem} dragOverItem={dragOverItem}>
                <div className="content-list">
                  <SortableContext
                    {...sortableContextProps}
                  >
                    {searchTerm ? (
                      <>
                        {rootItems.length > 0 && (
                          <div className="module-items-list">
                            {rootItems.map(item => (
                              <ModuleItem
                                key={item.id}
                                item={item}
                                onDelete={handleDeleteItem}
                                onEdit={handleEditItem}
                                searchTerm={searchTerm}
                                draggedItem={draggedItem}
                                dragOverItem={dragOverItem}
                              />
                            ))}
                          </div>
                        )}
                        {displayModules.length > 0 && (
                          <div className="module-list">
                            {displayModules.map(module => (
                              <ModuleCard
                                key={module.id}
                                module={module}
                                items={items}
                                onEdit={handleEditModule}
                                onDelete={handleDeleteModule}
                                onAddItem={handleAddItem}
                                onDeleteItem={handleDeleteItem}
                                onEditItem={handleEditItem}
                                ref={el => (moduleRefs.current[module.id] = el)}
                                searchTerm={searchTerm}
                                draggedItem={draggedItem}
                                dragOverItem={dragOverItem}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="ordered-content">
                        {orderedContent.map(content => (
                          content.type === 'module' ? (
                            <ModuleCard
                              key={content.id}
                              module={content}
                              items={items}
                              onEdit={handleEditModule}
                              onDelete={handleDeleteModule}
                              onAddItem={handleAddItem}
                              onDeleteItem={handleDeleteItem}
                              onEditItem={handleEditItem}
                              ref={el => (moduleRefs.current[content.id] = el)}
                              searchTerm={searchTerm}
                              draggedItem={draggedItem}
                              dragOverItem={dragOverItem}
                            />
                          ) : (
                            <div key={content.id} className="root-item-wrapper">
                              <ModuleItem
                                item={content}
                                onDelete={handleDeleteItem}
                                onEdit={handleEditItem}
                                searchTerm={searchTerm}
                                draggedItem={draggedItem}
                                dragOverItem={dragOverItem}
                              />
                            </div>
                          )
                        ))}
                      </div>
                    )}

                    {rootItems.length === 0 && draggedItem && draggedItem.startsWith('item-') && (
                      <div className="root-placeholder" style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        Drag items here to move them to root level
                      </div>
                    )}
                  </SortableContext>
                </div>
              </RootDropZone>
            </DndContext>
          )}
        </div>
      </div>

      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
        currentItem={currentItem}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
        currentItem={currentItem}
      />
    </div>
  );
};

export default CourseBuilder;
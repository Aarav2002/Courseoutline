import React, { createContext, useContext, useMemo } from 'react';
import { useCourseBuilder } from '../hooks/useCourseBuilder';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

const CourseBuilderContext = createContext();

export const CourseBuilderProvider = ({ children }) => {
  const courseBuilderState = useCourseBuilder();
  const dragAndDropState = useDragAndDrop();

  const contextValue = useMemo(() => ({
    ...courseBuilderState,
    ...dragAndDropState,
  }), [courseBuilderState, dragAndDropState]);

  return (
    <CourseBuilderContext.Provider value={contextValue}>
      {children}
    </CourseBuilderContext.Provider>
  );
};

export const useCourseBuilderContext = () => {
  const context = useContext(CourseBuilderContext);
  if (!context) {
    throw new Error('useCourseBuilderContext must be used within a CourseBuilderProvider');
  }
  return context;
};

export { CourseBuilderContext };

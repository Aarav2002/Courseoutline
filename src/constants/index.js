/**
 * Application Constants
 * Centralized configuration and constants for maintainability
 */

// Storage keys
export const STORAGE_KEYS = {
  COURSE_BUILDER_STATE: 'courseBuilderState:v1',
  USER_PREFERENCES: 'userPreferences:v1',
  THEME_SETTING: 'themeSetting:v1',
};

// Item types
export const ITEM_TYPES = {
  LINK: 'link',
  FILE: 'file',
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
  PDF: 'pdf',
};

// File extensions and their corresponding types
export const FILE_EXTENSIONS = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEOS: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  AUDIO: ['mp3', 'wav', 'flac', 'aac', 'ogg'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  SPREADSHEETS: ['xls', 'xlsx', 'csv'],
  PRESENTATIONS: ['ppt', 'pptx'],
};

// Operation types for undo/redo system
export const OPERATION_TYPES = {
  SAVE_MODULE: 'SAVE_MODULE',
  DELETE_MODULE: 'DELETE_MODULE',
  ADD_LINK: 'ADD_LINK',
  ADD_FILE: 'ADD_FILE',
  DELETE_ITEM: 'DELETE_ITEM',
  EDIT_ITEM: 'EDIT_ITEM',
  REORDER_MODULES: 'REORDER_MODULES',
  REORDER_ITEMS: 'REORDER_ITEMS',
};

// Search and filtering constants
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 100,
  SEARCH_DEBOUNCE_MS: 300,
  HIGHLIGHT_CLASS: 'search-highlight',
};

// Drag and drop constants
export const DRAG_AND_DROP = {
  MODULE_PREFIX: 'module-',
  ITEM_PREFIX: 'item-',
  DRAG_DEBOUNCE_MS: 100,
  SCROLL_OFFSET: 150,
  VISIBILITY_THRESHOLD: 0.3,
};

// UI constants
export const UI = {
  MODAL_ANIMATION_DURATION: 300,
  TOOLTIP_DELAY: 500,
  NOTIFICATION_DURATION: 3000,
  SCROLL_BEHAVIOR: 'smooth',
  SCROLL_BLOCK: 'start',
};

// Validation rules
export const VALIDATION_RULES = {
  MODULE_NAME_MIN_LENGTH: 1,
  MODULE_NAME_MAX_LENGTH: 100,
  ITEM_NAME_MIN_LENGTH: 1,
  ITEM_NAME_MAX_LENGTH: 200,
  URL_MAX_LENGTH: 2048,
  FILE_SIZE_MAX_MB: 100,
};

// Error messages
export const ERROR_MESSAGES = {
  MODULE_NAME_REQUIRED: 'Module name is required',
  MODULE_NAME_TOO_LONG: 'Module name cannot exceed 100 characters',
  ITEM_NAME_REQUIRED: 'Item name is required',
  ITEM_NAME_TOO_LONG: 'Item name cannot exceed 200 characters',
  URL_REQUIRED: 'URL is required for link items',
  URL_INVALID: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size cannot exceed 100MB',
  FILE_TYPE_NOT_SUPPORTED: 'File type is not supported',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Some data may not be saved.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  MODULE_CREATED: 'Module created successfully',
  MODULE_UPDATED: 'Module updated successfully',
  MODULE_DELETED: 'Module deleted successfully',
  ITEM_ADDED: 'Item added successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
  CHANGES_SAVED: 'Changes saved successfully',
};

// Performance constants
export const PERFORMANCE = {
  MAX_MODULES: 1000,
  MAX_ITEMS_PER_MODULE: 100,
  DEBOUNCE_DELAY: 100,
  THROTTLE_DELAY: 16, // ~60fps
  MEMORY_CLEANUP_INTERVAL: 30000, // 30 seconds
};

// Accessibility constants
export const ACCESSIBILITY = {
  ARIA_LABELS: {
    ADD_MODULE: 'Add new module',
    ADD_ITEM: 'Add new item',
    DELETE_MODULE: 'Delete module',
    DELETE_ITEM: 'Delete item',
    EDIT_MODULE: 'Edit module',
    EDIT_ITEM: 'Edit item',
    DRAG_HANDLE: 'Drag handle',
    SEARCH_INPUT: 'Search modules and items',
    MODULE_COLLAPSE: 'Collapse module',
    MODULE_EXPAND: 'Expand module',
  },
  KEYBOARD_SHORTCUTS: {
    ADD_MODULE: 'Ctrl+Shift+M',
    ADD_ITEM: 'Ctrl+Shift+I',
    SEARCH: 'Ctrl+F',
    UNDO: 'Ctrl+Z',
    REDO: 'Ctrl+Y',
    SAVE: 'Ctrl+S',
    ESCAPE: 'Escape',
  },
};

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  LARGE_DESKTOP: 1440,
};

// Animation durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Z-index layers
export const Z_INDEX = {
  BASE: 1,
  DROPDOWN: 100,
  MODAL: 1000,
  TOOLTIP: 1100,
  NOTIFICATION: 1200,
  OVERLAY: 1300,
};

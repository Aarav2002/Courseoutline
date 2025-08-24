/**
 * Data Structures and Algorithms Utility
 * Demonstrates various data structures and algorithms used in the course builder
 */

// Binary Search Tree for efficient module searching
export class ModuleSearchTree {
  constructor() {
    this.root = null;
  }

  insert(module) {
    const newNode = { module, left: null, right: null };

    if (!this.root) {
      this.root = newNode;
      return;
    }

    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    if (newNode.module.name.toLowerCase() < node.module.name.toLowerCase()) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  search(searchTerm) {
    const results = [];
    this._searchNode(this.root, searchTerm.toLowerCase(), results);
    return results;
  }

  _searchNode(node, searchTerm, results) {
    if (!node) return;

    if (node.module.name.toLowerCase().includes(searchTerm)) {
      results.push(node.module);
    }

    if (searchTerm < node.module.name.toLowerCase()) {
      this._searchNode(node.left, searchTerm, results);
    }
    this._searchNode(node.right, searchTerm, results);
  }
}

// Hash Map for fast item lookup by module ID
export class ItemHashMap {
  constructor() {
    this.map = new Map();
  }

  set(moduleId, items) {
    this.map.set(moduleId, items);
  }

  get(moduleId) {
    return this.map.get(moduleId) || [];
  }

  addItem(moduleId, item) {
    const items = this.get(moduleId);
    items.push(item);
    this.set(moduleId, items);
  }

  removeItem(moduleId, itemId) {
    const items = this.get(moduleId);
    const filteredItems = items.filter(item => item.id !== itemId);
    this.set(moduleId, filteredItems);
  }

  getAllItems() {
    return Array.from(this.map.values()).flat();
  }

  getItemCount(moduleId) {
    return this.get(moduleId).length;
  }
}

// Queue for managing undo/redo operations
export class OperationQueue {
  constructor(maxSize = 50) {
    this.operations = [];
    this.maxSize = maxSize;
    this.currentIndex = -1;
  }

  push(operation) {
    // Remove any operations after current index (for new operations after undo)
    this.operations = this.operations.slice(0, this.currentIndex + 1);

    this.operations.push(operation);
    this.currentIndex++;

    // Maintain max size
    if (this.operations.length > this.maxSize) {
      this.operations.shift();
      this.currentIndex--;
    }
  }

  undo() {
    if (this.currentIndex >= 0) {
      this.currentIndex--;
      return this.operations[this.currentIndex + 1];
    }
    return null;
  }

  redo() {
    if (this.currentIndex < this.operations.length - 1) {
      this.currentIndex++;
      return this.operations[this.currentIndex];
    }
    return null;
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.operations.length - 1;
  }
}

// Priority Queue for module ordering
export class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(module, priority = 0) {
    const element = { module, priority };

    if (this.isEmpty()) {
      this.queue.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.queue.length; i++) {
        if (element.priority < this.queue[i].priority) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.queue.push(element);
      }
    }
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.queue.shift().module;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.queue[0].module;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }
}

// Utility functions for data manipulation
export const dataUtils = {
  // Deep clone objects to prevent mutation
  deepClone: obj => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => dataUtils.deepClone(item));

    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = dataUtils.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  // Merge objects with deep merging
  deepMerge: (target, source) => {
    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          source[key] &&
          typeof source[key] === 'object' &&
          !Array.isArray(source[key])
        ) {
          result[key] = dataUtils.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  },

  // Validate data structure integrity
  validateModule: module => {
    const errors = [];

    if (!module.id || typeof module.id !== 'string') {
      errors.push('Module must have a valid string ID');
    }

    if (
      !module.name ||
      typeof module.name !== 'string' ||
      module.name.trim().length === 0
    ) {
      errors.push('Module must have a non-empty name');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  validateItem: item => {
    const errors = [];

    if (!item.id || typeof item.id !== 'string') {
      errors.push('Item must have a valid string ID');
    }

    // moduleId can be null for root-level items or a string for items inside modules
    if (
      item.moduleId !== null &&
      (typeof item.moduleId !== 'string' || item.moduleId.trim().length === 0)
    ) {
      errors.push(
        'Item must have a valid module ID or null for root-level items'
      );
    }

    if (
      !item.name ||
      typeof item.name !== 'string' ||
      item.name.trim().length === 0
    ) {
      errors.push('Item must have a non-empty name');
    }

    if (item.type === 'link' && (!item.url || typeof item.url !== 'string')) {
      errors.push('Link items must have a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Check for duplicate item names within a module
  checkDuplicateItemInModule: (items, moduleId, itemName, excludeItemId = null) => {
    const moduleItems = items.filter(item => item.moduleId === moduleId);
    const normalizedName = itemName.trim().toLowerCase();
    
    return moduleItems.some(item => {
      if (excludeItemId && item.id === excludeItemId) {
        return false; // Exclude the item being edited
      }
      return item.name.trim().toLowerCase() === normalizedName;
    });
  },

  // Get all item names within a specific module
  getModuleItemNames: (items, moduleId) => {
    return items
      .filter(item => item.moduleId === moduleId)
      .map(item => item.name.trim().toLowerCase());
  },

  // Validate if an item can be moved to a target module (no duplicates)
  canMoveItemToModule: (items, itemId, targetModuleId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    
    // If moving to the same module, it's always allowed
    if (item.moduleId === targetModuleId) return true;
    
    // Check for duplicates in target module
    return !dataUtils.checkDuplicateItemInModule(items, targetModuleId, item.name, itemId);
  },
};

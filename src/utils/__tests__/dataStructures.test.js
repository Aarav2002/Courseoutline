/**
 * Test suite for data structures and algorithms
 * Demonstrates testing approach for the implemented data structures
 */

import {
  ModuleSearchTree,
  ItemHashMap,
  OperationQueue,
  PriorityQueue,
  dataUtils,
} from '../dataStructures';

describe('ModuleSearchTree', () => {
  let tree;

  beforeEach(() => {
    tree = new ModuleSearchTree();
  });

  test('should insert modules correctly', () => {
    const module1 = { id: '1', name: 'Algebra' };
    const module2 = { id: '2', name: 'Calculus' };
    const module3 = { id: '3', name: 'Geometry' };

    tree.insert(module1);
    tree.insert(module2);
    tree.insert(module3);

    expect(tree.root).toBeTruthy();
    expect(tree.root.module.name).toBe('Algebra');
  });

  test('should search modules efficiently', () => {
    const modules = [
      { id: '1', name: 'Advanced Algebra' },
      { id: '2', name: 'Basic Calculus' },
      { id: '3', name: 'Linear Algebra' },
      { id: '4', name: 'Differential Equations' },
    ];

    modules.forEach(module => tree.insert(module));

    const results = tree.search('algebra');
    expect(results).toHaveLength(2);
    expect(results.some(m => m.name === 'Advanced Algebra')).toBe(true);
    expect(results.some(m => m.name === 'Linear Algebra')).toBe(true);
  });

  test('should handle empty tree', () => {
    const results = tree.search('test');
    expect(results).toHaveLength(0);
  });
});

describe('ItemHashMap', () => {
  let hashMap;

  beforeEach(() => {
    hashMap = new ItemHashMap();
  });

  test('should store and retrieve items by module ID', () => {
    const moduleId = 'module-1';
    const items = [
      { id: '1', name: 'Item 1', moduleId },
      { id: '2', name: 'Item 2', moduleId },
    ];

    items.forEach(item => hashMap.addItem(moduleId, item));

    const retrievedItems = hashMap.get(moduleId);
    expect(retrievedItems).toHaveLength(2);
    expect(retrievedItems).toEqual(items);
  });

  test('should return empty array for non-existent module', () => {
    const items = hashMap.get('non-existent');
    expect(items).toEqual([]);
  });

  test('should remove items correctly', () => {
    const moduleId = 'module-1';
    const item = { id: '1', name: 'Item 1', moduleId };

    hashMap.addItem(moduleId, item);
    expect(hashMap.getItemCount(moduleId)).toBe(1);

    hashMap.removeItem(moduleId, '1');
    expect(hashMap.getItemCount(moduleId)).toBe(0);
  });

  test('should get correct item count', () => {
    const moduleId = 'module-1';
    const items = [
      { id: '1', name: 'Item 1', moduleId },
      { id: '2', name: 'Item 2', moduleId },
      { id: '3', name: 'Item 3', moduleId },
    ];

    items.forEach(item => hashMap.addItem(moduleId, item));
    expect(hashMap.getItemCount(moduleId)).toBe(3);
  });
});

describe('OperationQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new OperationQueue(3); // Small size for testing
  });

  test('should push operations correctly', () => {
    const operation = {
      type: 'ADD_MODULE',
      data: { module: { id: '1', name: 'Test' } },
    };

    queue.push(operation);
    expect(queue.canUndo()).toBe(true);
    expect(queue.canRedo()).toBe(false);
  });

  test('should maintain size limit', () => {
    const operations = [
      { type: 'OP1', data: {} },
      { type: 'OP2', data: {} },
      { type: 'OP3', data: {} },
      { type: 'OP4', data: {} },
    ];

    operations.forEach(op => queue.push(op));

    // Should maintain max size of 3
    expect(queue.size()).toBe(3);
  });

  test('should handle undo/redo correctly', () => {
    const op1 = { type: 'OP1', data: {} };
    const op2 = { type: 'OP2', data: {} };

    queue.push(op1);
    queue.push(op2);

    expect(queue.canUndo()).toBe(true);
    expect(queue.canRedo()).toBe(false);

    const undoneOp = queue.undo();
    expect(undoneOp).toEqual(op2);
    expect(queue.canRedo()).toBe(true);

    const redoneOp = queue.redo();
    expect(redoneOp).toEqual(op2);
  });
});

describe('PriorityQueue', () => {
  let priorityQueue;

  beforeEach(() => {
    priorityQueue = new PriorityQueue();
  });

  test('should enqueue items with priority', () => {
    const module1 = { id: '1', name: 'High Priority' };
    const module2 = { id: '2', name: 'Low Priority' };

    priorityQueue.enqueue(module1, 1); // High priority (lower number)
    priorityQueue.enqueue(module2, 5); // Low priority (higher number)

    expect(priorityQueue.peek()).toEqual(module1);
  });

  test('should dequeue items in priority order', () => {
    const modules = [
      { id: '1', name: 'Priority 3' },
      { id: '2', name: 'Priority 1' },
      { id: '3', name: 'Priority 2' },
    ];

    modules.forEach((module, index) => {
      priorityQueue.enqueue(module, index + 1);
    });

    expect(priorityQueue.dequeue()).toEqual(modules[1]); // Priority 1
    expect(priorityQueue.dequeue()).toEqual(modules[2]); // Priority 2
    expect(priorityQueue.dequeue()).toEqual(modules[0]); // Priority 3
  });

  test('should handle empty queue', () => {
    expect(priorityQueue.isEmpty()).toBe(true);
    expect(priorityQueue.dequeue()).toBeNull();
    expect(priorityQueue.peek()).toBeNull();
  });
});

describe('dataUtils', () => {
  describe('deepClone', () => {
    test('should clone primitive values', () => {
      expect(dataUtils.deepClone(42)).toBe(42);
      expect(dataUtils.deepClone('test')).toBe('test');
      expect(dataUtils.deepClone(null)).toBe(null);
    });

    test('should deep clone objects', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = dataUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });

    test('should deep clone arrays', () => {
      const original = [1, [2, 3], { a: 4 }];
      const cloned = dataUtils.deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[1]).not.toBe(original[1]);
      expect(cloned[2]).not.toBe(original[2]);
    });
  });

  describe('validateModule', () => {
    test('should validate correct module', () => {
      const module = { id: '1', name: 'Valid Module' };
      const result = dataUtils.validateModule(module);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch missing ID', () => {
      const module = { name: 'Module without ID' };
      const result = dataUtils.validateModule(module);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Module must have a valid string ID');
    });

    test('should catch missing name', () => {
      const module = { id: '1' };
      const result = dataUtils.validateModule(module);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Module must have a non-empty name');
    });

    test('should catch empty name', () => {
      const module = { id: '1', name: '   ' };
      const result = dataUtils.validateModule(module);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Module must have a non-empty name');
    });
  });

  describe('validateItem', () => {
    test('should validate correct link item', () => {
      const item = {
        id: '1',
        moduleId: 'module-1',
        name: 'Link Item',
        type: 'link',
        url: 'https://example.com',
      };
      const result = dataUtils.validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should validate correct file item', () => {
      const item = {
        id: '1',
        moduleId: 'module-1',
        name: 'File Item',
        type: 'file',
      };
      const result = dataUtils.validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch missing URL for link items', () => {
      const item = {
        id: '1',
        moduleId: 'module-1',
        name: 'Link Item',
        type: 'link',
      };
      const result = dataUtils.validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Link items must have a valid URL');
    });

    test('should allow null module ID for root-level items', () => {
      const item = {
        id: '1',
        moduleId: null,
        name: 'Root-level item',
        type: 'file',
      };
      const result = dataUtils.validateItem(item);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should catch invalid module ID', () => {
      const item = {
        id: '1',
        moduleId: '',
        name: 'Item with empty module ID',
        type: 'file',
      };
      const result = dataUtils.validateItem(item);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        'Item must have a valid module ID or null for root-level items'
      );
    });
  });

  describe('checkDuplicateItemInModule', () => {
    test('should detect duplicate names in same module', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Duplicate Name' },
        { id: '2', moduleId: 'module-1', name: 'Unique Name' },
        { id: '3', moduleId: 'module-2', name: 'Duplicate Name' }, // Different module, ok
      ];

      const isDuplicate = dataUtils.checkDuplicateItemInModule(
        items,
        'module-1',
        'Duplicate Name'
      );
      expect(isDuplicate).toBe(true);
    });

    test('should not detect duplicate in different modules', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Test Name' },
        { id: '2', moduleId: 'module-2', name: 'Test Name' },
      ];

      const isDuplicate = dataUtils.checkDuplicateItemInModule(
        items,
        'module-2',
        'Different Name'
      );
      expect(isDuplicate).toBe(false);
    });

    test('should handle case-insensitive comparison', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Test Name' },
      ];

      const isDuplicate = dataUtils.checkDuplicateItemInModule(
        items,
        'module-1',
        'TEST NAME'
      );
      expect(isDuplicate).toBe(true);
    });

    test('should exclude item when editing', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Test Name' },
        { id: '2', moduleId: 'module-1', name: 'Other Name' },
      ];

      const isDuplicate = dataUtils.checkDuplicateItemInModule(
        items,
        'module-1',
        'Test Name',
        '1' // Exclude this item (editing scenario)
      );
      expect(isDuplicate).toBe(false);
    });
  });

  describe('canMoveItemToModule', () => {
    test('should allow moving item to module without duplicates', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Unique Name' },
        { id: '2', moduleId: 'module-2', name: 'Other Name' },
      ];

      const canMove = dataUtils.canMoveItemToModule(items, '1', 'module-2');
      expect(canMove).toBe(true);
    });

    test('should prevent moving item to module with duplicate name', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Same Name' },
        { id: '2', moduleId: 'module-2', name: 'Same Name' },
      ];

      const canMove = dataUtils.canMoveItemToModule(items, '1', 'module-2');
      expect(canMove).toBe(false);
    });

    test('should allow moving within same module', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Test Name' },
      ];

      const canMove = dataUtils.canMoveItemToModule(items, '1', 'module-1');
      expect(canMove).toBe(true);
    });

    test('should handle non-existent item', () => {
      const items = [
        { id: '1', moduleId: 'module-1', name: 'Test Name' },
      ];

      const canMove = dataUtils.canMoveItemToModule(items, 'non-existent', 'module-2');
      expect(canMove).toBe(false);
    });
  });
});

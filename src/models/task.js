const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../utils/database');

/**
 * Task model with database operations
 */
class Task {
  /**
   * Create a new task
   * @param {string} userId - Owner's user ID
   * @param {string} title - Task title
   * @param {string} description - Task description
   * @param {string} [status='pending'] - Task status
   * @returns {Promise<object>} The created task
   */
  static async create(userId, title, description, status = 'pending') {
    const db = getDatabase();
    
    const task = {
      id: uuidv4(),
      userId,
      title,
      description,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.data.tasks.push(task);
    await db.write();

    return task;
  }

  /**
   * Find all tasks for a user
   * @param {string} userId - User ID
   * @param {string} [statusFilter] - Optional status filter
   * @returns {Array} Array of task objects
   */
  static findByUserId(userId, statusFilter = null) {
    const db = getDatabase();
    let tasks = db.data.tasks.filter(task => task.userId === userId);
    
    if (statusFilter) {
      tasks = tasks.filter(task => task.status === statusFilter);
    }

    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Find a single task by ID and user ID
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @returns {object|null} The task object or null if not found
   */
  static findByIdAndUserId(taskId, userId) {
    const db = getDatabase();
    return db.data.tasks.find(task => task.id === taskId && task.userId === userId) || null;
  }

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @param {object} updates - Updates to apply
   * @returns {Promise<object|null>} The updated task or null if not found
   */
  static async update(taskId, userId, updates) {
    const db = getDatabase();
    const taskIndex = db.data.tasks.findIndex(task => task.id === taskId && task.userId === userId);
    
    if (taskIndex === -1) {
      return null;
    }

    const task = db.data.tasks[taskIndex];
    
    // Update allowed fields
    const allowedFields = ['title', 'description', 'status'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });
    
    task.updatedAt = new Date().toISOString();
    
    db.data.tasks[taskIndex] = task;
    await db.write();

    return task;
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(taskId, userId) {
    const db = getDatabase();
    const taskIndex = db.data.tasks.findIndex(task => task.id === taskId && task.userId === userId);
    
    if (taskIndex === -1) {
      return false;
    }

    db.data.tasks.splice(taskIndex, 1);
    await db.write();

    return true;
  }

  /**
   * Get all tasks (for development/testing)
   * @returns {Array} Array of all task objects
   */
  static getAll() {
    const db = getDatabase();
    return db.data.tasks;
  }

  /**
   * Check if a task belongs to a user
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @returns {boolean} True if task belongs to user
   */
  static belongsToUser(taskId, userId) {
    const db = getDatabase();
    const task = db.data.tasks.find(task => task.id === taskId);
    return task ? task.userId === userId : false;
  }
}

module.exports = Task;

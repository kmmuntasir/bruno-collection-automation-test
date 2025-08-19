const express = require('express');
const Task = require('../models/task');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

/**
 * POST /tasks
 * Create a new task
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(422).json({
        error: 'Title is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(422).json({
        error: 'Status must be either "pending" or "done"'
      });
    }

    // Create task
    const task = await Task.create(
      userId,
      title.trim(),
      description ? description.trim() : '',
      status || 'pending'
    );

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /tasks
 * Get all tasks for the authenticated user
 * Optional query parameter: ?status=pending|done
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    // Validate status filter if provided
    const validStatuses = ['pending', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(422).json({
        error: 'Status filter must be either "pending" or "done"'
      });
    }

    // Get tasks
    const tasks = Task.findByUserId(userId, status);

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = Task.findByIdAndUserId(taskId, userId);

    if (!task) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /tasks/:id
 * Update a task
 */
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, status } = req.body;

    // Check if task exists and belongs to user
    const existingTask = Task.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    // Validate updates
    const updates = {};
    
    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(422).json({
          error: 'Title cannot be empty'
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : '';
    }

    if (status !== undefined) {
      const validStatuses = ['pending', 'done'];
      if (!validStatuses.includes(status)) {
        return res.status(422).json({
          error: 'Status must be either "pending" or "done"'
        });
      }
      updates.status = status;
    }

    // Update task
    const updatedTask = await Task.update(taskId, userId, updates);

    if (!updatedTask) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * DELETE /tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const deleted = await Task.delete(taskId, userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;

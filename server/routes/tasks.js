const express = require('express');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const validateObjectId = require('../utils/validateObjectId');

const router = express.Router();

// GET /api/tasks - list all tasks, newest first
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  })
);

// POST /api/tasks - create a task
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;
    const task = await Task.create({ title, description, completed });
    res.status(201).json(task);
  })
);

// PATCH /api/tasks/:id - partially update a task
router.patch(
  '/:id',
  validateObjectId(),
  asyncHandler(async (req, res) => {
    const { title, description, completed } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = completed;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  })
);

// DELETE /api/tasks/:id - remove a task
router.delete(
  '/:id',
  validateObjectId(),
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  })
);

module.exports = router;

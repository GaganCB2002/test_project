const Task = require('../models/Task');
const Notification = require('../models/Notification');

const taskController = {
  create: async (req, res) => {
    try {
      const {
        title, description, column, priority, dueDate,
        estimatedHours, assignedTo, subtasks, dependencies
      } = req.body;
      const projectId = req.params.projectId;

      const task = new Task({
        title,
        description,
        project: projectId,
        workspace: req.project?.workspace,
        createdBy: req.user._id,
        column: column || 'To Do',
        priority: priority || 'medium',
        dueDate,
        estimatedHours,
        assignedTo,
        subtasks,
        dependencies
      });

      await task.save();

      if (assignedTo && assignedTo.length > 0) {
        const notifications = assignedTo.map(userId => ({
          user: userId,
          type: 'task',
          title: 'New Task Assigned',
          message: `You have been assigned to task: ${title}`,
          link: `/tasks/${task._id}`
        }));

        await Notification.insertMany(notifications);
      }

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.find({ project: projectId })
        .populate('assignedTo', 'firstName lastName avatar')
        .populate('createdBy', 'firstName lastName avatar')
        .populate('dependencies', 'title status')
        .sort('order');

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id)
        .populate('project', 'name color')
        .populate('assignedTo', 'firstName lastName avatar email role')
        .populate('createdBy', 'firstName lastName avatar')
        .populate('dependencies', 'title status');

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { title, description, column, priority, status, dueDate,
              estimatedHours, assignedTo, subtasks, order } = req.body;
      const task = req.task;

      const updates = {
        title, description, column, priority, status, dueDate,
        estimatedHours, assignedTo, subtasks, order
      };

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) task[key] = updates[key];
      });

      if (status) {
        task.activity.push({
          action: `Status changed to ${status}`,
          user: req.user._id,
          timestamp: new Date()
        });
      }

      await task.save();

      if (assignedTo) {
        const newAssignees = assignedTo.filter(
          id => !task.assignedTo.some(existing => existing.toString() === id)
        );

        if (newAssignees.length > 0) {
          const notifications = newAssignees.map(userId => ({
            user: userId,
            type: 'task',
            title: 'Task Assigned',
            message: `You have been assigned to task: ${task.title}`,
            link: `/tasks/${task._id}`
          }));

          await Notification.insertMany(notifications);
        }
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addComment: async (req, res) => {
    try {
      const { content } = req.body;
      const task = req.task;

      task.comments.push({
        content,
        user: req.user._id
      });

      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  addAttachment: async (req, res) => {
    try {
      const { filename, url, fileType } = req.body;
      const task = req.task;

      task.attachments.push({
        filename,
        url,
        fileType,
        uploadedBy: req.user._id
      });

      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  reorder: async (req, res) => {
    try {
      const { tasks } = req.body;

      const bulkOps = tasks.map(taskData => ({
        updateOne: {
          filter: { _id: taskData._id },
          update: { $set: { column: taskData.column, order: taskData.order } }
        }
      }));

      await Task.bulkWrite(bulkOps);

      res.json({ message: 'Tasks reordered successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = taskController;
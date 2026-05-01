const WorkLog = require('../models/WorkLog');

const workLogController = {
  create: async (req, res) => {
    try {
      const { date, hours, minutes, description, taskId, projectId, screenshots, appUsage, browserUsage } = req.body;

      const workLog = new WorkLog({
        user: req.user._id,
        date,
        hours,
        minutes,
        description,
        task: taskId,
        project: projectId,
        workspace: req.body.workspaceId,
        screenshots,
        appUsage,
        browserUsage
      });

      await workLog.save();
      res.status(201).json(workLog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMyLogs: async (req, res) => {
    try {
      const { page = 1, limit = 20, startDate, endDate } = req.query;
      const query = { user: req.user._id };

      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const logs = await WorkLog.find(query)
        .populate('task', 'title status')
        .populate('project', 'name color')
        .sort('-date')
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      const total = await WorkLog.countDocuments(query);

      res.json({
        logs,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = ['hours', 'minutes', 'description'];
      const workLog = req.workLog;

      updates.forEach(field => {
        if (req.body[field] !== undefined) {
          workLog[field] = req.body[field];
        }
      });

      await workLog.save();
      res.json(workLog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  startTracking: async (req, res) => {
    try {
      const user = req.user;
      user.trackingActive = true;
      await user.save();

      res.json({ message: 'Tracking started', trackingActive: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  stopTracking: async (req, res) => {
    try {
      const user = req.user;
      user.trackingActive = false;
      await user.save();

      res.json({ message: 'Tracking stopped', trackingActive: false });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateLocation: async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
      const user = req.user;

      user.location = { latitude, longitude, lastUpdated: new Date() };
      await user.save();

      res.json({ message: 'Location updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await WorkLog.findByIdAndDelete(req.params.id);
      res.json({ message: 'Work log deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = workLogController;
const WorkLog = require('../models/WorkLog');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const analyticsController = {
  getDashboardStats: async (req, res) => {
    try {
      const orgId = req.user.organization;

      const totalUsers = await User.countDocuments({ organization: orgId });
      const activeUsers = await User.countDocuments({ organization: orgId, isActive: true });

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const todaysWorkLogs = await WorkLog.find({
        user: { $in: await User.find({ organization: orgId }).distinct('_id') },
        date: { $gte: startOfDay, $lte: endOfDay }
      });

      const totalHoursWorked = todaysWorkLogs.reduce((sum, log) => sum + log.hours + (log.minutes / 60), 0);

      const tasks = await Task.find({
        workspace: { $in: req.user.workspaces }
      }).populate('assignedTo');

      const pendingTasks = tasks.filter(t => t.status === 'todo').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
      const completedTasks = tasks.filter(t => t.status === 'done').length;

      res.json({
        totalUsers,
        activeUsers,
        totalHoursWorked: Math.round(totalHoursWorked * 10) / 10,
        tasks: {
          total: tasks.length,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProductivityTrends: async (req, res) => {
    try {
      const { days = 7 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const workLogs = await WorkLog.find({
        user: { $in: await User.find({ organization: req.user.organization }).distinct('_id') },
        date: { $gte: startDate }
      }).sort('date');

      const trends = {};
      workLogs.forEach(log => {
        const dateStr = log.date.toISOString().split('T')[0];
        if (!trends[dateStr]) {
          trends[dateStr] = { hours: 0, tasksCompleted: 0 };
        }
        trends[dateStr].hours += log.hours + (log.minutes / 60);
      });

      const tasksByDate = await Task.find({
        status: 'done',
        updatedAt: { $gte: startDate }
      }).sort('updatedAt');

      tasksByDate.forEach(task => {
        const dateStr = task.updatedAt.toISOString().split('T')[0];
        if (trends[dateStr]) {
          trends[dateStr].tasksCompleted += 1;
        }
      });

      res.json(Object.entries(trends).map(([date, data]) => ({
        date,
        ...data
      })));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTaskAnalytics: async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;

      const tasks = await Task.find({ workspace: workspaceId });

      const byPriority = {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
        urgent: tasks.filter(t => t.priority === 'urgent').length
      };

      const byStatus = {
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        done: tasks.filter(t => t.status === 'done').length
      };

      const completionRate = tasks.length > 0
        ? Math.round((byStatus.done / tasks.length) * 100)
        : 0;

      res.json({
        total: tasks.length,
        byPriority,
        byStatus,
        completionRate
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserPerformance: async (req, res) => {
    try {
      const { userId } = req.params;
      const { days = 30 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      const workLogs = await WorkLog.find({
        user: userId,
        date: { $gte: startDate }
      });

      const totalHours = workLogs.reduce((sum, log) => sum + log.hours + (log.minutes / 60), 0);
      const totalActiveTime = workLogs.reduce((sum, log) => sum + log.activeTime, 0);
      const avgDailyHours = workLogs.length > 0 ? totalHours / workLogs.length : 0;

      const tasksCompleted = await Task.countDocuments({
        assignedTo: userId,
        status: 'done',
        updatedAt: { $gte: startDate }
      });

      res.json({
        totalHours: Math.round(totalHours * 10) / 10,
        totalActiveTime,
        avgDailyHours: Math.round(avgDailyHours * 10) / 10,
        tasksCompleted,
        workDays: workLogs.length
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTeamAnalytics: async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;

      const users = await User.find({
        workspaces: workspaceId
      }).select('_id firstName lastName role');

      const userIds = users.map(u => u._id);

      const workLogs = await WorkLog.find({
        user: { $in: userIds }
      });

      const teamData = users.map(user => {
        const userLogs = workLogs.filter(log => log.user.toString() === user._id.toString());
        const totalHours = userLogs.reduce((sum, log) => sum + log.hours + (log.minutes / 60), 0);

        return {
          user,
          totalHours: Math.round(totalHours * 10) / 10,
          avgDaily: userLogs.length > 0 ? Math.round((totalHours / userLogs.length) * 10) / 10 : 0
        };
      });

      res.json(teamData.sort((a, b) => b.totalHours - a.totalHours));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = analyticsController;
const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');

const leaveController = {
  create: async (req, res) => {
    try {
      const { leaveType, startDate, endDate, reason } = req.body;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const leaveRequest = new LeaveRequest({
        user: req.user._id,
        organization: req.user.organization,
        leaveType,
        startDate: start,
        endDate: end,
        totalDays,
        reason
      });

      await leaveRequest.save();
      res.status(201).json(leaveRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMyRequests: async (req, res) => {
    try {
      const requests = await LeaveRequest.find({ user: req.user._id })
        .sort('-createdAt');

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTeamRequests: async (req, res) => {
    try {
      const requests = await LeaveRequest.find({
        organization: req.user.organization
      })
        .populate('user', 'firstName lastName avatar role department')
        .sort('-createdAt');

      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  approve: async (req, res) => {
    try {
      const { remarks } = req.body;
      const leaveRequest = req.leaveRequest;

      leaveRequest.status = 'approved';
      leaveRequest.approvedBy = req.user._id;
      leaveRequest.approvedAt = new Date();
      leaveRequest.remarks = remarks;

      await leaveRequest.save();

      const notification = new Notification({
        user: leaveRequest.user,
        type: 'system',
        title: 'Leave Request Approved',
        message: `Your leave request for ${leaveRequest.totalDays} days has been approved`,
        link: `/leave/${leaveRequest._id}`
      });

      await notification.save();

      res.json(leaveRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  reject: async (req, res) => {
    try {
      const { remarks } = req.body;
      const leaveRequest = req.leaveRequest;

      leaveRequest.status = 'rejected';
      leaveRequest.approvedBy = req.user._id;
      leaveRequest.approvedAt = new Date();
      leaveRequest.remarks = remarks;

      await leaveRequest.save();

      const notification = new Notification({
        user: leaveRequest.user,
        type: 'system',
        title: 'Leave Request Rejected',
        message: `Your leave request has been rejected. Reason: ${remarks || 'No reason provided'}`,
        link: `/leave/${leaveRequest._id}`
      });

      await notification.save();

      res.json(leaveRequest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = leaveController;
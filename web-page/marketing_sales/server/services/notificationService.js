const Activity = require('../models/Activity');

exports.createActivity = async (io, data) => {
  try {
    const activity = new Activity({
      companyId: data.companyId,
      user: data.userId,
      userName: data.userName,
      type: data.type,
      action: data.action,
      description: data.description,
      metadata: data.metadata
    });

    await activity.save();

    // Broadcast to the company's room
    if (io) {
      io.to(data.companyId).emit('new_activity', activity);
      
      // Also send as a formal notification for toasts
      io.to(data.companyId).emit('notification', {
        title: `${data.type} ${data.action}`,
        message: data.description,
        type: data.type.toLowerCase()
      });
    }

    return activity;
  } catch (error) {
    console.error('Activity Creation Error:', error);
  }
};

exports.getRecentActivities = async (companyId, limit = 10) => {
  return await Activity.find({ companyId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

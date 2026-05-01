import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import { io } from '../server.js';

export const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, assignedTo, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based filtering
    if (req.user.role === 'employee') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'it_staff') {
      query.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate('createdBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Ticket.countDocuments(query)
    ]);

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email avatar department')
      .populate('assignedTo', 'name email avatar')
      .populate('comments.author', 'name email avatar');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id
    });

    await ticket.populate('createdBy', 'name email avatar');

    // Notify IT staff
    if (process.env.NODE_ENV !== 'test') {
      const notification = await Notification.create({
        user: req.user._id,
        type: 'ticket_created',
        title: 'Ticket Created',
        message: `Ticket "${title}" has been created.`,
        link: `/tickets/${ticket._id}`
      });
      io.emit('notification', notification);
    }

    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority, status } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    // Update fields
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (status) {
      ticket.status = status;
      if (status === 'resolved') ticket.resolvedAt = new Date();
      if (status === 'closed') ticket.closedAt = new Date();
    }

    await ticket.save();
    await ticket.populate('createdBy', 'name email avatar');
    await ticket.populate('assignedTo', 'name email avatar');

    // Notify relevant users
    if (ticket.assignedTo) {
      const notification = await Notification.create({
        user: ticket.assignedTo._id,
        type: 'ticket_updated',
        title: 'Ticket Updated',
        message: `Ticket "${ticket.title}" has been updated.`,
        link: `/tickets/${ticket._id}`
      });
      io.to(ticket.assignedTo._id.toString()).emit('notification', notification);
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    res.json({ message: 'Ticket deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    ticket.assignedTo = assignedTo;
    if (assignedTo) {
      ticket.status = 'in_progress';
    }
    await ticket.save();

    await ticket.populate('createdBy', 'name email avatar');
    await ticket.populate('assignedTo', 'name email avatar');

    // Notify assigned user
    if (assignedTo) {
      const notification = await Notification.create({
        user: assignedTo,
        type: 'ticket_assigned',
        title: 'Ticket Assigned',
        message: `Ticket "${ticket.title}" has been assigned to you.`,
        link: `/tickets/${ticket._id}`
      });
      io.to(assignedTo.toString()).emit('notification', notification);
    }

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    ticket.comments.push({
      text,
      author: req.user._id
    });

    await ticket.save();
    await ticket.populate('comments.author', 'name email avatar');

    const newComment = ticket.comments[ticket.comments.length - 1];

    // Notify relevant users
    const notifyUsers = [ticket.createdBy];
    if (ticket.assignedTo) notifyUsers.push(ticket.assignedTo);
    const currentUserId = req.user._id.toString();

    notifyUsers.forEach(async (userId) => {
      if (userId.toString() !== currentUserId) {
        const notification = await Notification.create({
          user: userId,
          type: 'comment_added',
          title: 'New Comment',
          message: `${req.user.name} commented on ticket "${ticket.title}".`,
          link: `/tickets/${ticket._id}`
        });
        io.to(userId.toString()).emit('notification', notification);
      }
    });

    res.status(201).json({ comment: newComment });
  } catch (error) {
    next(error);
  }
};

export const getTicketStats = async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved, closed, byPriority, byCategory] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in_progress' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.countDocuments({ status: 'closed' }),
      Ticket.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Ticket.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    // Calculate average resolution time
    const resolvedTickets = await Ticket.find({
      status: { $in: ['resolved', 'closed'] },
      resolvedAt: { $exists: true }
    }).select('createdAt resolvedAt');

    let avgResolutionTime = 0;
    if (resolvedTickets.length > 0) {
      const totalTime = resolvedTickets.reduce((acc, ticket) => {
        return acc + (ticket.resolvedAt - ticket.createdAt);
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60)); // in hours
    }

    res.json({
      stats: {
        total,
        open,
        inProgress,
        resolved,
        closed,
        byPriority,
        byCategory,
        avgResolutionTime
      }
    });
  } catch (error) {
    next(error);
  }
};

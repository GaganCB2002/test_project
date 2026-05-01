import Asset from '../models/Asset.js';
import Notification from '../models/Notification.js';
import { io } from '../server.js';

export const getAssets = async (req, res, next) => {
  try {
    const { status, category, assignedTo, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const [assets, total] = await Promise.all([
      Asset.find(query)
        .populate('assignedTo', 'name email avatar department')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Asset.countDocuments(query)
    ]);

    res.json({
      assets,
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

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('assignedTo', 'name email avatar department')
      .populate('history.from', 'name email')
      .populate('history.to', 'name email');

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.json({ asset });
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req, res, next) => {
  try {
    const { name, type, serialNumber, category, status, purchaseDate, warrantyExpiry, location, notes } = req.body;

    const existingAsset = await Asset.findOne({ serialNumber });
    if (existingAsset) {
      return res.status(400).json({ message: 'Serial number already exists.' });
    }

    const asset = await Asset.create({
      name,
      type,
      serialNumber,
      category,
      status: status || 'available',
      purchaseDate,
      warrantyExpiry,
      location,
      notes
    });

    res.status(201).json({ asset });
  } catch (error) {
    next(error);
  }
};

export const updateAsset = async (req, res, next) => {
  try {
    const { name, type, serialNumber, category, status, purchaseDate, warrantyExpiry, location, notes } = req.body;

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    // Update fields
    if (name) asset.name = name;
    if (type) asset.type = type;
    if (serialNumber) asset.serialNumber = serialNumber;
    if (category) asset.category = category;
    if (status) asset.status = status;
    if (purchaseDate) asset.purchaseDate = purchaseDate;
    if (warrantyExpiry) asset.warrantyExpiry = warrantyExpiry;
    if (location) asset.location = location;
    if (notes !== undefined) asset.notes = notes;

    await asset.save();
    await asset.populate('assignedTo', 'name email avatar department');

    res.json({ asset });
  } catch (error) {
    next(error);
  }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.json({ message: 'Asset deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

export const assignAsset = async (req, res, next) => {
  try {
    const { assignedTo, notes } = req.body;

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const historyEntry = {
      action: assignedTo ? 'assigned' : 'unassigned',
      from: asset.assignedTo,
      to: assignedTo,
      date: new Date(),
      notes
    };

    asset.history.push(historyEntry);
    asset.assignedTo = assignedTo;
    asset.status = assignedTo ? 'assigned' : 'available';

    await asset.save();
    await asset.populate('assignedTo', 'name email avatar department');

    // Notify user
    if (assignedTo) {
      const notification = await Notification.create({
        user: assignedTo,
        type: 'asset_assigned',
        title: 'Asset Assigned',
        message: `Asset "${asset.name}" has been assigned to you.`,
        link: `/assets/${asset._id}`
      });
      io.to(assignedTo.toString()).emit('notification', notification);
    }

    res.json({ asset });
  } catch (error) {
    next(error);
  }
};

export const getAssetStats = async (req, res, next) => {
  try {
    const [total, available, assigned, maintenance, retired, byCategory, expiringWarranties] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'available' }),
      Asset.countDocuments({ status: 'assigned' }),
      Asset.countDocuments({ status: 'maintenance' }),
      Asset.countDocuments({ status: 'retired' }),
      Asset.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Asset.countDocuments({
        warrantyExpiry: {
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
          $gte: new Date()
        }
      })
    ]);

    res.json({
      stats: {
        total,
        available,
        assigned,
        maintenance,
        retired,
        byCategory,
        expiringWarranties
      }
    });
  } catch (error) {
    next(error);
  }
};

import { Router } from 'express';
import { auth } from '../middleware/auth.js';

const router = Router();

// GET / - List all activities
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // TODO: Get activities
    // const activities = await Activity.find()
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit))
    //   .populate('userId', 'name');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /user/:userId - Get activities for a user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // TODO: Get user activities
    // const activities = await Activity.find({ userId: req.params.userId })
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit))
    //   .populate('userId', 'name');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /entity/:entityType/:entityId - Get activities for an entity
router.get('/entity/:entityType/:entityId', auth, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // TODO: Get entity activities
    // const activities = await Activity.find({
    //   entityType,
    //   entityId
    // })
    //   .sort({ createdAt: -1 })
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit))
    //   .populate('userId', 'name');

    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
import express from 'express';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  assignAsset,
  getAssetStats
} from '../controllers/assetController.js';
import { auth } from '../middleware/auth.js';
import { isITStaffOrAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/stats', auth, getAssetStats);
router.get('/', auth, getAssets);
router.get('/:id', auth, getAssetById);
router.post('/', auth, isITStaffOrAdmin, createAsset);
router.put('/:id', auth, isITStaffOrAdmin, updateAsset);
router.delete('/:id', auth, isITStaffOrAdmin, deleteAsset);
router.put('/:id/assign', auth, isITStaffOrAdmin, assignAsset);

export default router;

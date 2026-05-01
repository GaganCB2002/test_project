import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getITStaff
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/it-staff', auth, getITStaff);
router.get('/', auth, isAdmin, getUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, isAdmin, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

export default router;

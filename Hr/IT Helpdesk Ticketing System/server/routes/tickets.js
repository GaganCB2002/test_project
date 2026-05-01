import express from 'express';
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  addComment,
  getTicketStats
} from '../controllers/ticketController.js';
import { auth } from '../middleware/auth.js';
import { isITStaffOrAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/stats', auth, getTicketStats);
router.get('/', auth, getTickets);
router.get('/:id', auth, getTicketById);
router.post('/', auth, createTicket);
router.put('/:id', auth, updateTicket);
router.delete('/:id', auth, isITStaffOrAdmin, deleteTicket);
router.put('/:id/assign', auth, isITStaffOrAdmin, assignTicket);
router.post('/:id/comments', auth, addComment);

export default router;

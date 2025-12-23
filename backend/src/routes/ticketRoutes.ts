import express from 'express';
import { getTickets, createTicket, getTicket, deleteTicket, updateTicket, getAllTickets } from '../controllers/ticketController';
import { protect, agent } from '../middleware/authMiddleware';

// Import note routes
import noteRoutes from './noteRoutes';

const router = express.Router();

// Re-route into note router
router.use('/:ticketId/notes', noteRoutes);

// Ticket routes
router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/all').get(protect, agent, getAllTickets);
router.route('/:id').get(protect, getTicket).delete(protect, deleteTicket).put(protect, updateTicket);

export default router;

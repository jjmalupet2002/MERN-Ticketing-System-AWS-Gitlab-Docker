import express from 'express';
import { getNotes, addNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getNotes).post(protect, addNote);

export default router;

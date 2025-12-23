import { Response } from 'express';
import Note from '../models/Note';
import Ticket from '../models/Ticket';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
export const getNotes = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        // Check if user owns the ticket or is agent/admin
        const isOwner = ticket.user.toString() === req.user!._id.toString();
        const isStaff = req.user!.role === 'agent' || req.user!.role === 'admin';

        if (!isOwner && !isStaff) {
            res.status(401).json({ message: 'Not authorized to view these notes' });
            return;
        }

        const notes = await Note.find({ ticket: req.params.ticketId })
            .populate('user', 'name email role')
            .sort({ createdAt: 1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create note for a ticket
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
export const addNote = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;

        if (!text) {
            res.status(400).json({ message: 'Please add text to the note' });
            return;
        }

        const ticket = await Ticket.findById(req.params.ticketId);

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        // Check if user owns the ticket or is agent/admin
        const isOwner = ticket.user.toString() === req.user!._id.toString();
        const isStaff = req.user!.role === 'agent' || req.user!.role === 'admin';

        if (!isOwner && !isStaff) {
            res.status(401).json({ message: 'Not authorized to add notes to this ticket' });
            return;
        }

        const note = await Note.create({
            ticket: req.params.ticketId,
            user: req.user!._id,
            text,
            isStaffNote: isStaff,
        });

        // Populate user info before returning
        await note.populate('user', 'name email role');

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

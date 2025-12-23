import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req: AuthRequest, res: Response) => {
    const tickets = await Ticket.find({ user: req.user?._id } as any);
    res.status(200).json(tickets);
};

// @desc    Get all tickets (for agents/admins)
// @route   GET /api/tickets/all
// @access  Private (Agent/Admin only)
export const getAllTickets = async (req: AuthRequest, res: Response) => {
    try {
        const tickets = await Ticket.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req: AuthRequest, res: Response) => {
    const { product, description, title } = req.body;

    if (!product || !description || !title) {
        res.status(400).json({ message: 'Please add a product, description and title' });
        return;
    }

    const ticket = await Ticket.create({
        product,
        title,
        description,
        user: req.user?._id,
        status: 'new',
    } as any);

    res.status(201).json(ticket);
};

// @desc    Get ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('user', 'name email');

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        // Allow access if user owns ticket OR is agent/admin
        const isOwner = ticket.user._id.toString() === req.user!._id.toString();
        const isStaff = req.user!.role === 'agent' || req.user!.role === 'admin';

        if (!isOwner && !isStaff) {
            res.status(401).json({ message: 'Not Authorized' });
            return;
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(404).json({ message: 'Ticket not found' });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
export const deleteTicket = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        if (ticket.user.toString() !== req.user!._id.toString()) {
            res.status(401).json({ message: 'Not Authorized' });
            return;
        }

        await ticket.deleteOne();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(404).json({ message: 'Ticket not found' });
    }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
export const updateTicket = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        // Allow update if user owns ticket OR is agent/admin
        const isOwner = ticket.user.toString() === req.user!._id.toString();
        const isStaff = req.user!.role === 'agent' || req.user!.role === 'admin';

        if (!isOwner && !isStaff) {
            res.status(401).json({ message: 'Not Authorized' });
            return;
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(404).json({ message: 'Ticket not found' });
    }
};

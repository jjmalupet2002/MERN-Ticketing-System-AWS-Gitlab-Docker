import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { SocketManager } from '../socket/socketManager';
import { sendEmail, emailTemplates } from '../utils/emailUtility';

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
            .populate('assignedTo', 'name email')
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
    const { product, description, title, priority, tags } = req.body;

    if (!product || !description || !title) {
        res.status(400).json({ message: 'Please add a product, title and description' });
        return;
    }

    // Handle file attachments if present
    const attachments = (req.files as Express.Multer.File[])?.map(file => ({
        // Use file.path for Cloudinary URL, fall back to file.filename for local
        filename: file.path || file.filename,
        originalName: file.originalname,
        uploadedAt: new Date(),
    })) || [];

    const ticket = await Ticket.create({
        product,
        description,
        title,
        priority: priority || 'medium',
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
        attachments,
        user: req.user?._id,
    });

    // Socket Event: New Ticket Created (Optional: Notify admins dashboard)
    // const io = SocketManager.getInstance();
    // io.io.emit('new_ticket_dashboard', ticket); 

    res.status(201).json(ticket);
};

// @desc    Get ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

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
        )
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        // Socket Event: Notify active users viewing the ticket
        const io = SocketManager.getInstance();
        io.emitToTicket(req.params.id, 'ticket_updated', updatedTicket);

        // Email Trigger: If Status Changed to Closed
        if (req.body.status === 'closed' && req.body.status !== ticket.status) {
            const user = await User.findById(ticket.user);
            if (user) {
                // Send email to User
                sendEmail({
                    to: user.email,
                    subject: `Ticket #${ticket._id} Closed: ${ticket.title}`,
                    html: emailTemplates.ticketClosed(
                        ticket._id.toString(),
                        ticket.title
                    )
                });

                // Notify User via Socket
                io.emitToUser(user._id.toString(), 'notification', {
                    message: `Ticket #${ticket._id} has been closed`,
                    ticketId: ticket._id.toString(),
                    type: 'CLOSED'
                });
            }
        }

        // Email Trigger: If Assigned
        if (req.body.assignedTo && req.body.assignedTo !== ticket.assignedTo?.toString()) {
            const agent = await User.findById(req.body.assignedTo);
            const user = await User.findById(ticket.user); // Get ticket owner

            if (agent) {
                // Send email to Agent
                sendEmail({
                    to: agent.email,
                    subject: `New Ticket Assigned: #${ticket._id}`,
                    html: emailTemplates.ticketAssigned(
                        ticket._id.toString(),
                        ticket.title,
                        agent.name
                    )
                });
            }

            if (user && agent) {
                // Notify User via Socket
                io.emitToUser(user._id.toString(), 'notification', {
                    message: `Ticket #${ticket._id} claimed by ${agent.name}`,
                    ticketId: ticket._id.toString(),
                    type: 'ASSIGNED'
                });

                // Send email to User
                sendEmail({
                    to: user.email,
                    subject: `Ticket #${ticket._id} Claimed by Agent`,
                    html: emailTemplates.ticketUpdated(
                        ticket._id.toString(),
                        ticket.title,
                        `Your ticket has been claimed by ${agent.name}.`
                    )
                });
            }
        }

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(404).json({ message: 'Ticket not found' });
    }
};

import { Response } from 'express';
import Ticket from '../models/Ticket';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { createNotification } from './notificationController';
import { sendEmail, emailTemplates } from '../utils/emailUtility';
import { SocketManager } from '../socket/socketManager';

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
export const getNotes = async (req: AuthRequest, res: Response) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId)
            .populate('notes.author', 'name email role');

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

        res.status(200).json(ticket.notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create note for a ticket
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
export const addNote = async (req: AuthRequest, res: Response) => {
    try {
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ message: 'Please add content to the note' });
            return;
        }

        const ticket = await Ticket.findById(req.params.ticketId)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        // Check if user owns the ticket or is agent/admin
        const isOwner = (ticket.user as any)._id.toString() === req.user!._id.toString();
        const isStaff = req.user!.role === 'agent' || req.user!.role === 'admin';

        if (!isOwner && !isStaff) {
            res.status(401).json({ message: 'Not authorized to add notes to this ticket' });
            return;
        }

        // Add the note to the ticket's notes array
        const note = {
            author: req.user!._id,
            role: req.user!.role,
            content,
            createdAt: new Date(),
        };

        ticket.notes.push(note);
        await ticket.save();

        // Populate the newly added note's author
        await ticket.populate('notes.author', 'name email role');

        // Socket Event: Real-time Chat
        const io = SocketManager.getInstance();
        io.emitToTicket(req.params.ticketId, 'new_note', ticket.notes[ticket.notes.length - 1]);

        // Send Response immediately for better UX
        res.status(201).json(ticket.notes[ticket.notes.length - 1]);

        // Background Tasks: Notifications & Emails (Don't await these to block response)
        // We use a non-awaited async immediately invoked function or just let the promise float
        (async () => {
            try {
                // Populate the newly added note's author (already done for response, but needed safe)
                // If agent/admin replied, notify the ticket owner
                // If user replied, notify the assigned agent
                if (isStaff && ticket.user) {
                    const ticketOwner = ticket.user as any;
                    await createNotification(
                        ticketOwner._id,
                        ticket._id,
                        'REPLY',
                        `${req.user!.name} replied to your ticket: ${ticket.title}`
                    );

                    // Send email to ticket owner
                    await sendEmail({
                        to: ticketOwner.email,
                        subject: `New reply on ticket #${ticket._id.toString().slice(-6).toUpperCase()}`,
                        html: emailTemplates.ticketReply(
                            ticket._id.toString().slice(-6).toUpperCase(),
                            ticket.title,
                            req.user!.name,
                            content
                        ),
                    });
                } else if (!isStaff && ticket.assignedTo) {
                    const assignedAgent = ticket.assignedTo as any;
                    await createNotification(
                        assignedAgent._id,
                        ticket._id,
                        'REPLY',
                        `${req.user!.name} replied to ticket: ${ticket.title}`
                    );

                    // Send email to assigned agent
                    await sendEmail({
                        to: assignedAgent.email,
                        subject: `New reply on ticket #${ticket._id.toString().slice(-6).toUpperCase()}`,
                        html: emailTemplates.ticketReply(
                            ticket._id.toString().slice(-6).toUpperCase(),
                            ticket.title,
                            req.user!.name,
                            content
                        ),
                    });
                }

                // Notify the recipient via Socket (Red Dot / Toast)
                const recipientId = (isStaff && ticket.user)
                    ? (ticket.user as any)._id
                    : (!isStaff && ticket.assignedTo)
                        ? (ticket.assignedTo as any)._id
                        : null;

                if (recipientId) {
                    io.emitToUser(recipientId.toString(), 'notification', {
                        message: `New reply from ${req.user!.name}`,
                        ticketId: ticket._id.toString()
                    });
                }
            } catch (bgError) {
                console.error('Background Notification/Email failed:', bgError);
            }
        })();
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

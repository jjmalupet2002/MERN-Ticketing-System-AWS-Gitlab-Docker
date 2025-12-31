import { Response } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find({ recipient: req.user!._id })
            .populate('ticket', 'title _id status')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user!._id,
            seen: false,
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        // Ensure the notification belongs to the user
        if (notification.recipient.toString() !== req.user!._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        notification.seen = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
    try {
        await Notification.updateMany(
            { recipient: req.user!._id, seen: false },
            { seen: true }
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to create a notification (used by other controllers)
export const createNotification = async (
    recipientId: mongoose.Types.ObjectId,
    ticketId: mongoose.Types.ObjectId,
    type: 'ASSIGNED' | 'UPDATED' | 'CLOSED' | 'REPLY',
    message: string
) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            ticket: ticketId,
            type,
            message,
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

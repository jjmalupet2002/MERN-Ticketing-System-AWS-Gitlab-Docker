import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    ticket: mongoose.Types.ObjectId;
    type: 'ASSIGNED' | 'UPDATED' | 'CLOSED' | 'REPLY';
    message: string;
    seen: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    type: {
        type: String,
        enum: ['ASSIGNED', 'UPDATED', 'CLOSED', 'REPLY'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<INotification>('Notification', notificationSchema);

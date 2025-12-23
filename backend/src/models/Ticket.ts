import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
    user: mongoose.Types.ObjectId;
    product: string;
    title: string;
    description: string;
    status: 'new' | 'open' | 'closed';
}

const ticketSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    product: {
        type: String,
        required: true,
        enum: ['iPhone', 'Macbook Pro', 'iMac', 'iPad'],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'open', 'closed'],
        default: 'new',
    },
}, {
    timestamps: true,
});

export default mongoose.model<ITicket>('Ticket', ticketSchema);

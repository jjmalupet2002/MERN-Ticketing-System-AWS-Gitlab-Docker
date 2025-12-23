import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
    author: mongoose.Types.ObjectId;
    role: 'user' | 'agent' | 'admin';
    content: string;
    createdAt: Date;
}

export interface ITicket extends Document {
    user: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    product: string;
    title: string;
    description: string;
    status: 'new' | 'open' | 'closed';
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    attachments: { filename: string; originalName: string; uploadedAt: Date }[];
    notes: INote[];
}

const ticketSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
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
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    tags: {
        type: [String],
        default: [],
    },
    attachments: [{
        filename: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    notes: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'agent', 'admin'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
}, {
    timestamps: true,
});

export default mongoose.model<ITicket>('Ticket', ticketSchema);

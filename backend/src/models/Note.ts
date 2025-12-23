import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
    ticket: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    text: string;
    isStaffNote: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ticket',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    text: {
        type: String,
        required: [true, 'Please add text to the note'],
    },
    isStaffNote: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.model<INote>('Note', noteSchema);

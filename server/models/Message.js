import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    // Reference to the conversation this message belongs to
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    // User who sent the message
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Text content of the message
    content: {
        type: String,
        trim: true
    },
    // File attachment (if any)
    file: {
        url: {
            type: String
        },
        type: {
            type: String,
            enum: ['image', 'document']
        },
        filename: {
            type: String
        }
    },
    // Array of user IDs who have read this message
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for faster queries
messageSchema.index({ conversation: 1, createdAt: -1 });

// Validation: Message must have either content or file
messageSchema.pre('save', function (next) {
    if (!this.content && !this.file?.url) {
        return next(new Error('Message must have either text content or a file attachment'));
    }
    next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;

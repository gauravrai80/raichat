import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    // Array of user IDs participating in the conversation
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    // Flag to distinguish between private (1-to-1) and group chats
    isGroup: {
        type: Boolean,
        default: false
    },
    // Group chat specific fields
    groupName: {
        type: String,
        trim: true
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Reference to the last message in the conversation
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    // Track unread message count per user
    unreadCount: {
        type: Map,
        of: Number,
        default: new Map()
    }
}, {
    timestamps: true
});

// Index for faster queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Validation: Private chats must have exactly 2 participants
conversationSchema.pre('save', function (next) {
    if (!this.isGroup && this.participants.length !== 2) {
        return next(new Error('Private conversations must have exactly 2 participants'));
    }
    if (this.isGroup && this.participants.length < 2) {
        return next(new Error('Group conversations must have at least 2 participants'));
    }
    next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;

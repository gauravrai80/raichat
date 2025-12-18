import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

/**
 * Send a new message
 * POST /api/messages
 */
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, content, file } = req.body;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: 'Conversation ID is required'
            });
        }

        if (!content && !file) {
            return res.status(400).json({
                success: false,
                message: 'Message must have either content or file'
            });
        }

        // Verify conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!conversation.participants.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this conversation'
            });
        }

        // Create message
        const messageData = {
            conversation: conversationId,
            sender: req.user._id,
            readBy: [req.user._id] // Sender has read their own message
        };

        if (content) messageData.content = content;
        if (file) messageData.file = file;

        const message = await Message.create(messageData);

        // Update conversation's last message
        conversation.lastMessage = message._id;
        await conversation.save();

        // Populate message with sender info
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username avatar');

        res.status(201).json({
            success: true,
            message: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: error.message
        });
    }
};

/**
 * Get messages for a conversation
 * GET /api/messages/:conversationId?page=1&limit=50
 */
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Verify user is participant in conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!conversation.participants.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'You are not a participant in this conversation'
            });
        }

        // Get messages with pagination
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'username avatar')
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const totalMessages = await Message.countDocuments({ conversation: conversationId });

        res.status(200).json({
            success: true,
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages,
                hasMore: skip + messages.length < totalMessages
            }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: error.message
        });
    }
};

/**
 * Mark message as read
 * PUT /api/messages/:id/read
 */
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Add user to readBy array if not already there
        if (!message.readBy.includes(req.user._id)) {
            message.readBy.push(req.user._id);
            await message.save();
        }

        res.status(200).json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking message as read',
            error: error.message
        });
    }
};

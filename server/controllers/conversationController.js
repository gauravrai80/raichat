import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

/**
 * Create or get existing private conversation
 * POST /api/conversations
 */
export const createPrivateConversation = async (req, res) => {
    try {
        const { participantId } = req.body;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: 'Participant ID is required'
            });
        }

        // Check if conversation already exists between these two users
        const existingConversation = await Conversation.findOne({
            isGroup: false,
            participants: { $all: [req.user._id, participantId] }
        }).populate('participants', '-password')
            .populate('lastMessage');

        if (existingConversation) {
            return res.status(200).json({
                success: true,
                conversation: existingConversation
            });
        }

        // Create new conversation
        const conversation = await Conversation.create({
            participants: [req.user._id, participantId],
            isGroup: false
        });

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', '-password');

        res.status(201).json({
            success: true,
            conversation: populatedConversation
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating conversation',
            error: error.message
        });
    }
};

/**
 * Create group conversation
 * POST /api/conversations/group
 */
export const createGroupConversation = async (req, res) => {
    try {
        const { participantIds, groupName } = req.body;

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 1) {
            return res.status(400).json({
                success: false,
                message: 'At least one participant is required'
            });
        }

        if (!groupName) {
            return res.status(400).json({
                success: false,
                message: 'Group name is required'
            });
        }

        // Add current user to participants
        const allParticipants = [req.user._id, ...participantIds];

        // Create group conversation
        const conversation = await Conversation.create({
            participants: allParticipants,
            isGroup: true,
            groupName,
            groupAdmin: req.user._id
        });

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', '-password')
            .populate('groupAdmin', '-password');

        res.status(201).json({
            success: true,
            conversation: populatedConversation
        });
    } catch (error) {
        console.error('Create group error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating group',
            error: error.message
        });
    }
};

/**
 * Get all conversations for current user
 * GET /api/conversations
 */
export const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id
        })
            .populate('participants', '-password')
            .populate('groupAdmin', '-password')
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'sender',
                    select: 'username avatar'
                }
            })
            .sort({ updatedAt: -1 }); // Sort by most recent activity

        res.status(200).json({
            success: true,
            count: conversations.length,
            conversations
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching conversations',
            error: error.message
        });
    }
};

/**
 * Add members to group conversation
 * PUT /api/conversations/:id/members
 */
export const addGroupMembers = async (req, res) => {
    try {
        const { id } = req.params;
        const { participantIds } = req.body;

        if (!participantIds || !Array.isArray(participantIds)) {
            return res.status(400).json({
                success: false,
                message: 'Participant IDs array is required'
            });
        }

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found'
            });
        }

        if (!conversation.isGroup) {
            return res.status(400).json({
                success: false,
                message: 'Cannot add members to private conversation'
            });
        }

        // Check if current user is admin
        if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only group admin can add members'
            });
        }

        // Add new participants (avoid duplicates)
        participantIds.forEach(id => {
            if (!conversation.participants.includes(id)) {
                conversation.participants.push(id);
            }
        });

        await conversation.save();

        const updatedConversation = await Conversation.findById(id)
            .populate('participants', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json({
            success: true,
            conversation: updatedConversation
        });
    } catch (error) {
        console.error('Add members error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding members',
            error: error.message
        });
    }
};

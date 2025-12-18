import express from 'express';
import {
    createPrivateConversation,
    createGroupConversation,
    getUserConversations,
    addGroupMembers
} from '../controllers/conversationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All conversation routes are protected
router.post('/', protect, createPrivateConversation);
router.post('/group', protect, createGroupConversation);
router.get('/', protect, getUserConversations);
router.put('/:id/members', protect, addGroupMembers);

export default router;

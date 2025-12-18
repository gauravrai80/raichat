import express from 'express';
import { sendMessage, getMessages, markAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All message routes are protected
router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.put('/:id/read', protect, markAsRead);

export default router;

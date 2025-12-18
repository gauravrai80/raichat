import express from 'express';
import { getAllUsers, searchUsers, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All user routes are protected
router.get('/', protect, getAllUsers);
router.get('/search', protect, searchUsers);
router.put('/profile', protect, updateProfile);

export default router;

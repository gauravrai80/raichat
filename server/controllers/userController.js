import User from '../models/User.js';

/**
 * Get all users except the current user
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        // Find all users except the current logged-in user
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('-password')
            .sort({ username: 1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * Search users by username or email
 * GET /api/users/search?query=searchterm
 */
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search for users matching the query (case-insensitive)
        const users = await User.find({
            _id: { $ne: req.user._id }, // Exclude current user
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
            .select('-password')
            .limit(10); // Limit results to 10 users

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
};

/**
 * Update user profile
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { username, avatar } = req.body;
        const updateData = {};

        if (username) updateData.username = username;
        if (avatar) updateData.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

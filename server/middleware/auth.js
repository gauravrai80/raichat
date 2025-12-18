import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication middleware to verify JWT tokens
 * Attaches the authenticated user to req.user
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header (Bearer token)
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Also check for token in cookies
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error in authentication'
        });
    }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};

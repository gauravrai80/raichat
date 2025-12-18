import api from './api';

/**
 * Get all users
 */
export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

/**
 * Search users by query
 */
export const searchUsers = async (query) => {
    const response = await api.get(`/users/search?query=${query}`);
    return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
};

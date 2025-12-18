import api from './api';

/**
 * Get all conversations for current user
 */
export const getConversations = async () => {
    const response = await api.get('/conversations');
    return response.data;
};

/**
 * Create or get private conversation
 */
export const createConversation = async (participantId) => {
    const response = await api.post('/conversations', { participantId });
    return response.data;
};

/**
 * Create group conversation
 */
export const createGroup = async (groupData) => {
    const response = await api.post('/conversations/group', groupData);
    return response.data;
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/${conversationId}?page=${page}&limit=${limit}`);
    return response.data;
};

/**
 * Send a message
 */
export const sendMessage = async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
};

/**
 * Mark message as read
 */
export const markAsRead = async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
};

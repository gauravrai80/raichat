import User from '../models/User.js';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Store online users: Map of socketId -> userId
const onlineUsers = new Map();

/**
 * Initialize Socket.IO event handlers
 */
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // Handle user coming online
        socket.on('user:online', async (userId) => {
            try {
                // Store user's socket connection
                onlineUsers.set(socket.id, userId);

                // Update user's online status in database
                await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    lastSeen: new Date()
                });

                // Broadcast to all clients that this user is online
                io.emit('user:status', {
                    userId,
                    isOnline: true
                });

                console.log(`User ${userId} is online`);
            } catch (error) {
                console.error('Error setting user online:', error);
            }
        });

        // Handle user joining a conversation room
        socket.on('conversation:join', (conversationId) => {
            socket.join(conversationId);
            console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
        });

        // Handle user leaving a conversation room
        socket.on('conversation:leave', (conversationId) => {
            socket.leave(conversationId);
            console.log(`Socket ${socket.id} left conversation ${conversationId}`);
        });

        // Handle sending a message
        socket.on('message:send', async (data) => {
            try {
                const { conversationId, senderId, content, file } = data;

                // Create message in database
                const messageData = {
                    conversation: conversationId,
                    sender: senderId,
                    readBy: [senderId]
                };

                if (content) messageData.content = content;
                if (file) messageData.file = file;

                const message = await Message.create(messageData);

                // Update conversation's last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: message._id
                });

                // Populate message with sender info
                const populatedMessage = await Message.findById(message._id)
                    .populate('sender', 'username avatar');

                // Emit message to all users in the conversation room
                io.to(conversationId).emit('message:receive', populatedMessage);

                console.log(`Message sent in conversation ${conversationId}`);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message:error', { message: 'Failed to send message' });
            }
        });

        // Handle typing indicator start
        socket.on('typing:start', (data) => {
            const { conversationId, userId, username } = data;
            // Broadcast to all users in conversation except sender
            socket.to(conversationId).emit('typing:display', {
                conversationId,
                userId,
                username,
                isTyping: true
            });
        });

        // Handle typing indicator stop
        socket.on('typing:stop', (data) => {
            const { conversationId, userId } = data;
            // Broadcast to all users in conversation except sender
            socket.to(conversationId).emit('typing:display', {
                conversationId,
                userId,
                isTyping: false
            });
        });

        // Handle message read status
        socket.on('message:read', async (data) => {
            try {
                const { messageId, userId } = data;

                const message = await Message.findById(messageId);
                if (message && !message.readBy.includes(userId)) {
                    message.readBy.push(userId);
                    await message.save();

                    // Notify conversation participants
                    io.to(message.conversation.toString()).emit('message:read:update', {
                        messageId,
                        userId
                    });
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        // Handle user disconnect
        socket.on('disconnect', async () => {
            try {
                const userId = onlineUsers.get(socket.id);

                if (userId) {
                    // Remove from online users map
                    onlineUsers.delete(socket.id);

                    // Update user's online status in database
                    await User.findByIdAndUpdate(userId, {
                        isOnline: false,
                        lastSeen: new Date()
                    });

                    // Broadcast to all clients that this user is offline
                    io.emit('user:status', {
                        userId,
                        isOnline: false
                    });

                    console.log(`User ${userId} went offline`);
                }

                console.log('Client disconnected:', socket.id);
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });

    // Return function to get online users
    return {
        getOnlineUsers: () => Array.from(onlineUsers.values())
    };
};

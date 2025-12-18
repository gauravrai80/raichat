import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
            const newSocket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            // Connection event handlers
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setConnected(true);
                // Notify server that user is online
                newSocket.emit('user:online', user._id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setConnected(false);
            });

            // Listen for user status updates
            newSocket.on('user:status', ({ userId, isOnline }) => {
                setOnlineUsers((prev) => {
                    if (isOnline) {
                        return [...new Set([...prev, userId])];
                    } else {
                        return prev.filter((id) => id !== userId);
                    }
                });
            });

            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                newSocket.close();
            };
        } else {
            // Disconnect socket if user logs out
            if (socket) {
                socket.close();
                setSocket(null);
                setConnected(false);
            }
        }
    }, [user]);

    // Emit typing start event
    const emitTypingStart = (conversationId, username) => {
        if (socket && user) {
            socket.emit('typing:start', {
                conversationId,
                userId: user._id,
                username,
            });
        }
    };

    // Emit typing stop event
    const emitTypingStop = (conversationId) => {
        if (socket && user) {
            socket.emit('typing:stop', {
                conversationId,
                userId: user._id,
            });
        }
    };

    // Join conversation room
    const joinConversation = (conversationId) => {
        if (socket) {
            socket.emit('conversation:join', conversationId);
        }
    };

    // Leave conversation room
    const leaveConversation = (conversationId) => {
        if (socket) {
            socket.emit('conversation:leave', conversationId);
        }
    };

    const value = {
        socket,
        connected,
        onlineUsers,
        emitTypingStart,
        emitTypingStop,
        joinConversation,
        leaveConversation,
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

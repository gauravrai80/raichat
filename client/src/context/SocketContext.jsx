import { createContext, useContext, useEffect, useState, useRef } from 'react';
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

    // Track current conversation for auto-rejoin on reconnect
    const currentConversationRef = useRef(null);

    useEffect(() => {
        if (user) {
            // Get Socket.IO URL from environment variable
            const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

            console.log('🔌 Connecting to Socket.IO server:', socketUrl);

            // Initialize socket connection with production-ready configuration
            const newSocket = io(socketUrl, {
                // Enable both WebSocket and polling for maximum compatibility
                transports: ['websocket', 'polling'],

                // Reconnection settings
                reconnection: true,
                reconnectionDelay: 1000,        // Start with 1s delay
                reconnectionDelayMax: 5000,     // Max 5s delay between attempts
                reconnectionAttempts: 10,       // Try 10 times before giving up

                // Connection timeout settings
                timeout: 20000,                 // 20s connection timeout

                // Enable transport upgrade from polling to WebSocket
                upgrade: true,

                // Send credentials (cookies)
                withCredentials: true
            });

            // Connection event handlers
            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                setConnected(true);

                // Notify server that user is online
                newSocket.emit('user:online', user._id);

                // Rejoin current conversation if exists
                if (currentConversationRef.current) {
                    console.log('🔄 Rejoining conversation:', currentConversationRef.current);
                    newSocket.emit('conversation:join', currentConversationRef.current);
                }
            });

            newSocket.on('disconnect', (reason) => {
                console.log('❌ Socket disconnected:', reason);
                setConnected(false);

                // Log different disconnect reasons
                if (reason === 'io server disconnect') {
                    console.log('⚠️ Server disconnected the socket, will attempt to reconnect');
                } else if (reason === 'transport close') {
                    console.log('⚠️ Connection lost, will attempt to reconnect');
                }
            });

            // Reconnection event handlers
            newSocket.on('reconnect', (attemptNumber) => {
                console.log('🔄 Reconnected after', attemptNumber, 'attempts');
                setConnected(true);
            });

            newSocket.on('reconnect_attempt', (attemptNumber) => {
                console.log('🔄 Reconnection attempt', attemptNumber);
            });

            newSocket.on('reconnect_error', (error) => {
                console.error('❌ Reconnection error:', error.message);
            });

            newSocket.on('reconnect_failed', () => {
                console.error('❌ Reconnection failed after maximum attempts');
                setConnected(false);
            });

            // Connection error handlers
            newSocket.on('connect_error', (error) => {
                console.error('❌ Connection error:', error.message);

                // If WebSocket fails, socket.io will automatically try polling
                if (error.message.includes('websocket')) {
                    console.log('⚠️ WebSocket failed, falling back to polling...');
                }
            });

            newSocket.on('connect_timeout', () => {
                console.error('❌ Connection timeout');
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
                console.log('🔌 Closing socket connection');
                newSocket.close();
            };
        } else {
            // Disconnect socket if user logs out
            if (socket) {
                socket.close();
                setSocket(null);
                setConnected(false);
                currentConversationRef.current = null;
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
            console.log('📥 Joining conversation:', conversationId);
            socket.emit('conversation:join', conversationId);
            currentConversationRef.current = conversationId;
        }
    };

    // Leave conversation room
    const leaveConversation = (conversationId) => {
        if (socket) {
            console.log('📤 Leaving conversation:', conversationId);
            socket.emit('conversation:leave', conversationId);
            if (currentConversationRef.current === conversationId) {
                currentConversationRef.current = null;
            }
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

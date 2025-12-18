import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import {
    getConversations as getConversationsService,
    getMessages as getMessagesService,
    sendMessage as sendMessageService,
    createConversation as createConversationService,
} from '../services/chatService';

const ChatContext = createContext();

// Custom hook to use chat context
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { socket } = useSocket();
    const { user } = useAuth();

    // Fetch conversations on mount
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    // Listen for new messages via socket
    useEffect(() => {
        if (socket) {
            socket.on('message:receive', (newMessage) => {
                // Add message to current conversation if it matches
                if (selectedConversation && newMessage.conversation === selectedConversation._id) {
                    setMessages((prev) => [...prev, newMessage]);
                }

                // Update conversation's last message
                setConversations((prev) =>
                    prev.map((conv) =>
                        conv._id === newMessage.conversation
                            ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
                            : conv
                    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                );
            });

            return () => {
                socket.off('message:receive');
            };
        }
    }, [socket, selectedConversation]);

    // Fetch all conversations
    const fetchConversations = async () => {
        try {
            setLoading(true);
            const data = await getConversationsService();
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch messages for a conversation
    const fetchMessages = async (conversationId) => {
        try {
            setLoading(true);
            const data = await getMessagesService(conversationId);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send a message
    const sendMessage = async (messageData) => {
        try {
            // Emit via socket for real-time delivery
            if (socket) {
                socket.emit('message:send', {
                    ...messageData,
                    senderId: user._id,
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Create or get conversation
    const createConversation = async (participantId) => {
        try {
            const data = await createConversationService(participantId);
            if (data.success) {
                // Check if conversation already exists in list
                const exists = conversations.find((conv) => conv._id === data.conversation._id);
                if (!exists) {
                    setConversations((prev) => [data.conversation, ...prev]);
                }
                setSelectedConversation(data.conversation);
                fetchMessages(data.conversation._id);
                return data.conversation;
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    // Select a conversation
    const selectConversation = (conversation) => {
        setSelectedConversation(conversation);
        fetchMessages(conversation._id);
    };

    const value = {
        conversations,
        selectedConversation,
        messages,
        loading,
        fetchConversations,
        fetchMessages,
        sendMessage,
        createConversation,
        selectConversation,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

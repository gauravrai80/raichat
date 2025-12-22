import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ onBack }) => {
    const { selectedConversation, messages } = useChat();
    const { socket, onlineUsers, joinConversation, leaveConversation } = useSocket();
    const { user } = useAuth();
    const [typingUsers, setTypingUsers] = useState([]);

    // Join/leave conversation rooms
    useEffect(() => {
        if (selectedConversation && socket) {
            joinConversation(selectedConversation._id);

            return () => {
                leaveConversation(selectedConversation._id);
            };
        }
    }, [selectedConversation, socket]);

    // Listen for typing indicators
    useEffect(() => {
        if (socket) {
            socket.on('typing:display', ({ conversationId, userId, username, isTyping }) => {
                if (selectedConversation && conversationId === selectedConversation._id && userId !== user._id) {
                    if (isTyping) {
                        setTypingUsers((prev) => [...new Set([...prev, { userId, username }])]);
                    } else {
                        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
                    }
                }
            });

            return () => {
                socket.off('typing:display');
            };
        }
    }, [socket, selectedConversation, user]);

    // Get conversation display name
    const getConversationName = () => {
        if (!selectedConversation) return '';

        if (selectedConversation.isGroup) {
            return selectedConversation.groupName;
        }
        const otherParticipant = selectedConversation.participants.find((p) => p._id !== user._id);
        return otherParticipant?.username || 'Unknown';
    };

    // Check if other user is online (for private chats)
    const isOtherUserOnline = () => {
        if (!selectedConversation || selectedConversation.isGroup) return false;
        const otherParticipant = selectedConversation.participants.find((p) => p._id !== user._id);
        return otherParticipant && onlineUsers.includes(otherParticipant._id);
    };

    if (!selectedConversation) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center px-6">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Select a Conversation</h3>
                    <p className="text-[var(--color-text-secondary)]">Choose a chat from the list to start messaging</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Chat header */}
            <div className="p-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3">
                {/* Mobile Back Button */}
                <button
                    onClick={onBack}
                    className="md:hidden btn-icon"
                    aria-label="Back to conversations"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="flex items-center gap-3 flex-1">
                    <div className="avatar avatar-md">
                        <div className="w-full h-full bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-semibold">
                            {getConversationName().charAt(0).toUpperCase()}
                        </div>
                        {isOtherUserOnline() && <div className="status-dot status-dot-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-[var(--color-text-primary)] truncate">{getConversationName()}</h2>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                            {selectedConversation.isGroup
                                ? `${selectedConversation.participants.length} members`
                                : isOtherUserOnline()
                                    ? 'Online'
                                    : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} />

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
                <TypingIndicator username={typingUsers[0].username} />
            )}

            {/* Message input */}
            <MessageInput />
        </div>
    );
};

export default ChatWindow;

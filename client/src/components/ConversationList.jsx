import { format } from 'date-fns';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ConversationList = ({ onSelectConversation }) => {
    const { conversations, selectedConversation, selectConversation } = useChat();
    const { onlineUsers } = useSocket();
    const { user } = useAuth();

    // Get conversation display name
    const getConversationName = (conversation) => {
        if (conversation.isGroup) {
            return conversation.groupName;
        }
        const otherParticipant = conversation.participants.find((p) => p._id !== user._id);
        return otherParticipant?.username || 'Unknown';
    };

    // Get conversation avatar
    const getConversationAvatar = (conversation) => {
        if (conversation.isGroup) {
            return 'https://via.placeholder.com/150/0084ff/FFFFFF?text=G';
        }
        const otherParticipant = conversation.participants.find((p) => p._id !== user._id);
        return otherParticipant?.avatar || 'https://via.placeholder.com/150';
    };

    // Check if other user is online
    const isOtherUserOnline = (conversation) => {
        if (conversation.isGroup) return false;
        const otherParticipant = conversation.participants.find((p) => p._id !== user._id);
        return otherParticipant && onlineUsers.includes(otherParticipant._id);
    };

    const handleSelectConversation = (conversation) => {
        selectConversation(conversation);
        onSelectConversation?.();
    };

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">No Conversations Yet</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Start a new chat to begin messaging</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto flex-1">
            {conversations.map((conversation) => {
                const isSelected = selectedConversation?._id === conversation._id;
                const lastMessage = conversation.lastMessage;
                const isOnline = isOtherUserOnline(conversation);

                return (
                    <div
                        key={conversation._id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`chat-item ${isSelected ? 'chat-item-active' : ''}`}
                    >
                        {/* Avatar */}
                        <div className="avatar avatar-md">
                            <img
                                src={getConversationAvatar(conversation)}
                                alt={getConversationName(conversation)}
                                className="w-full h-full object-cover"
                            />
                            {isOnline && <div className="status-dot" />}
                        </div>

                        {/* Conversation info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                                    {getConversationName(conversation)}
                                </h3>
                                {lastMessage && (
                                    <span className="text-xs text-[var(--color-text-tertiary)] flex-shrink-0 ml-2">
                                        {format(new Date(conversation.updatedAt), 'MMM d')}
                                    </span>
                                )}
                            </div>

                            {/* Last message preview */}
                            {lastMessage && (
                                <p className="text-sm text-[var(--color-text-secondary)] truncate">
                                    {lastMessage.sender?._id === user._id && 'You: '}
                                    {lastMessage.content || (lastMessage.file ? '📎 Attachment' : '')}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;

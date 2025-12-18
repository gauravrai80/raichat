import { format } from 'date-fns';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const ConversationList = () => {
    const { conversations, selectedConversation, selectConversation } = useChat();
    const { user } = useAuth();

    // Get conversation display name
    const getConversationName = (conversation) => {
        if (conversation.isGroup) {
            return conversation.groupName;
        }
        // For private chats, show the other participant's name
        const otherParticipant = conversation.participants.find((p) => p._id !== user._id);
        return otherParticipant?.username || 'Unknown';
    };

    // Get conversation avatar
    const getConversationAvatar = (conversation) => {
        if (conversation.isGroup) {
            return 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=Group';
        }
        const otherParticipant = conversation.participants.find((p) => p._id !== user._id);
        return otherParticipant?.avatar || 'https://via.placeholder.com/150';
    };

    if (conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                <p>No conversations yet</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto">
            {conversations.map((conversation) => {
                const isSelected = selectedConversation?._id === conversation._id;
                const lastMessage = conversation.lastMessage;

                return (
                    <div
                        key={conversation._id}
                        onClick={() => selectConversation(conversation)}
                        className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary-50 border-l-4 border-primary-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        {/* Avatar */}
                        <img
                            src={getConversationAvatar(conversation)}
                            alt={getConversationName(conversation)}
                            className="w-12 h-12 rounded-full"
                        />

                        {/* Conversation info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {getConversationName(conversation)}
                                </h3>
                                {lastMessage && (
                                    <span className="text-xs text-gray-500">
                                        {format(new Date(conversation.updatedAt), 'MMM d')}
                                    </span>
                                )}
                            </div>

                            {/* Last message preview */}
                            {lastMessage && (
                                <p className="text-sm text-gray-600 truncate">
                                    {lastMessage.sender?._id === user._id && 'You: '}
                                    {lastMessage.content || (lastMessage.file ? '📎 File' : '')}
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

import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import FilePreview from './FilePreview';

const MessageList = ({ messages }) => {
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-[var(--color-text-secondary)]">No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg-chat)]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f0f0f0" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
            {messages.map((message) => {
                const isSent = message.sender._id === user._id;

                return (
                    <div
                        key={message._id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isSent ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            {/* Avatar */}
                            {!isSent && (
                                <img
                                    src={message.sender.avatar}
                                    alt={message.sender.username}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}

                            {/* Message bubble */}
                            <div>
                                {!isSent && (
                                    <p className="text-xs text-gray-500 mb-1 px-2">{message.sender.username}</p>
                                )}

                                <div
                                    className={`message-bubble ${isSent ? 'message-sent' : 'message-received'
                                        }`}
                                >
                                    {/* Text content */}
                                    {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

                                    {/* File attachment */}
                                    {message.file && <FilePreview file={message.file} />}
                                </div>

                                {/* Timestamp */}
                                <p className={`text-xs text-gray-400 mt-1 px-2 ${isSent ? 'text-right' : 'text-left'}`}>
                                    {format(new Date(message.createdAt), 'h:mm a')}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;

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
            <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>No messages yet. Start the conversation!</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

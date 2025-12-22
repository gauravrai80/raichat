import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../services/uploadService';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, selectedConversation } = useChat();
    const { emitTypingStart, emitTypingStop } = useSocket();
    const { user } = useAuth();

    const handleTyping = (e) => {
        setMessage(e.target.value);

        // Emit typing start
        if (selectedConversation) {
            emitTypingStart(selectedConversation._id, user.username);

            // Clear previous timeout
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }

            // Set timeout to emit typing stop after 2 seconds of inactivity
            const timeout = setTimeout(() => {
                emitTypingStop(selectedConversation._id);
            }, 2000);

            setTypingTimeout(timeout);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim() || !selectedConversation) return;

        // Clear typing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        emitTypingStop(selectedConversation._id);

        // Send message
        await sendMessage({
            conversationId: selectedConversation._id,
            content: message.trim(),
        });

        setMessage('');
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedConversation) return;

        try {
            setUploading(true);

            // Upload file to Cloudinary
            const response = await uploadFile(file);

            if (response.success) {
                // Send message with file
                await sendMessage({
                    conversationId: selectedConversation._id,
                    file: response.file,
                });
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="border-t border-[var(--color-border)] p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* File upload button */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || !selectedConversation}
                    className="btn-icon text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Attach file"
                    aria-label="Attach file"
                >
                    {uploading ? (
                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    )}
                </button>

                {/* Message input */}
                <input
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder={selectedConversation ? "Type a message..." : "Select a conversation"}
                    disabled={!selectedConversation}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-[var(--color-primary)] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                />

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!message.trim() || !selectedConversation}
                    className="w-11 h-11 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)]"
                    aria-label="Send message"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default MessageInput;

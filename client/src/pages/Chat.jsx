import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConversationListOpen, setIsConversationListOpen] = useState(true);

    return (
        <div className="h-screen flex overflow-hidden bg-[var(--color-bg-main)]">
            {/* Mobile Overlay */}
            {(isSidebarOpen || !isConversationListOpen) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => {
                        setIsSidebarOpen(false);
                        setIsConversationListOpen(true);
                    }}
                />
            )}

            {/* Left Sidebar - User List */}
            <div className={`
                fixed md:relative z-30 md:z-0
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <Sidebar
                    onClose={() => {
                        setIsSidebarOpen(false);
                        setIsConversationListOpen(false);
                    }}
                />
            </div>

            {/* Middle Panel - Conversations */}
            <div className={`
                w-full md:w-96 bg-white border-r border-[var(--color-border)] flex flex-col
                fixed md:relative z-20 md:z-0 h-full
                transform transition-transform duration-300 ease-in-out
                ${isConversationListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-4 bg-white border-b border-[var(--color-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="md:hidden btn-icon"
                            aria-label="Toggle sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Chats</h1>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-3 bg-white border-b border-[var(--color-border)]">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="search-bar"
                    />
                </div>

                {/* Conversation List */}
                <ConversationList onSelectConversation={() => setIsConversationListOpen(false)} />
            </div>

            {/* Right Panel - Chat Window */}
            <ChatWindow onBack={() => setIsConversationListOpen(true)} />
        </div>
    );
};

export default Chat;

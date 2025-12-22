import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getAllUsers } from '../services/userService';
import { useSocket } from '../context/SocketContext';
import ProfileEditModal from './ProfileEditModal';

const Sidebar = ({ onClose }) => {
    const { user, logout } = useAuth();
    const { createConversation } = useChat();
    const { onlineUsers } = useSocket();
    const [showUsers, setShowUsers] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const handleShowUsers = async () => {
        if (!showUsers) {
            setLoading(true);
            try {
                const data = await getAllUsers();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        }
        setShowUsers(!showUsers);
    };

    const handleStartChat = async (userId) => {
        await createConversation(userId);
        setShowUsers(false);
        // Close sidebar on mobile after selecting a user
        if (onClose) {
            onClose();
        }
    };

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    return (
        <div className="w-80 bg-white border-r border-[var(--color-border)] flex flex-col h-full">
            {/* Header */}
            <div className="p-4 bg-[var(--color-primary)] text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="avatar avatar-md">
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                            <div className="status-dot status-dot-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-white truncate">{user.username}</h2>
                            <p className="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowEditProfile(true)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Edit Profile"
                            aria-label="Edit Profile"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Logout"
                            aria-label="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* New chat button */}
                <button
                    onClick={handleShowUsers}
                    className="w-full bg-white text-[var(--color-primary)] font-medium py-2.5 px-4 rounded-lg hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2"
                >
                    {showUsers ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Chat
                        </>
                    )}
                </button>
            </div>

            {/* Users list or empty state */}
            <div className="flex-1 overflow-y-auto">
                {showUsers ? (
                    <div>
                        <div className="p-3 bg-gray-50 border-b border-[var(--color-border)] sticky top-0">
                            <h3 className="font-semibold text-[var(--color-text-primary)]">All Users</h3>
                        </div>
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Loading users...</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {users.map((u) => (
                                    <div
                                        key={u._id}
                                        onClick={() => handleStartChat(u._id)}
                                        className="chat-item"
                                    >
                                        <div className="avatar avatar-md">
                                            <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                                            {isUserOnline(u._id) && <div className="status-dot" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-[var(--color-text-primary)] truncate">{u.username}</h4>
                                            <p className="text-xs text-[var(--color-text-secondary)]">
                                                {isUserOnline(u._id) ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
                        <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Start a Conversation</h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">Click "New Chat" above to see all users and start chatting</p>
                    </div>
                )}
            </div>

            {/* Profile Edit Modal */}
            <ProfileEditModal
                isOpen={showEditProfile}
                onClose={() => setShowEditProfile(false)}
            />
        </div>
    );
};

export default Sidebar;

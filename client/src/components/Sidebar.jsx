import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { getAllUsers } from '../services/userService';
import { useSocket } from '../context/SocketContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { createConversation } = useChat();
    const { onlineUsers } = useSocket();
    const [showUsers, setShowUsers] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

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
    };

    const isUserOnline = (userId) => {
        return onlineUsers.includes(userId);
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 bg-primary-600 text-white">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="font-semibold">{user.username}</h2>
                            <p className="text-xs text-primary-100">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 hover:bg-primary-700 rounded-full transition-colors"
                        title="Logout"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

                {/* New chat button */}
                <button
                    onClick={handleShowUsers}
                    className="w-full bg-white text-primary-600 font-medium py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors"
                >
                    {showUsers ? 'Hide Users' : '+ New Chat'}
                </button>
            </div>

            {/* Users list or empty state */}
            <div className="flex-1 overflow-y-auto">
                {showUsers ? (
                    <div>
                        <div className="p-3 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-700">All Users</h3>
                        </div>
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading users...</div>
                        ) : (
                            <div>
                                {users.map((u) => (
                                    <div
                                        key={u._id}
                                        onClick={() => handleStartChat(u._id)}
                                        className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="relative">
                                            <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-full" />
                                            {isUserOnline(u._id) && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{u.username}</h4>
                                            <p className="text-xs text-gray-500">{isUserOnline(u._id) ? 'Online' : 'Offline'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-center px-4">Click "New Chat" to start a conversation</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

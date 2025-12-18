import Sidebar from '../components/Sidebar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Left sidebar - User list */}
            <Sidebar />

            {/* Middle panel - Conversations */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <ConversationList />
            </div>

            {/* Right panel - Chat window */}
            <ChatWindow />
        </div>
    );
};

export default Chat;

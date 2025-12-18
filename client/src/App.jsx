import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <ChatProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Navigate to="/chat" replace />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/chat"
                                element={
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </ChatProvider>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;

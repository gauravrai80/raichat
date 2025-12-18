import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing user on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Register function
    const register = async (userData) => {
        try {
            setError(null);
            const data = await registerService(userData);

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                return { success: true };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Login function
    const login = async (credentials) => {
        try {
            setError(null);
            const data = await loginService(credentials);

            if (data.success) {
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                return { success: true };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await logoutService();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

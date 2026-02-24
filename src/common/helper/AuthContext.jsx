import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [modalState, setModalState] = useState(null); // can be 'login', 'register', or null
    const [user, setUser] = useState(null); // Initialize with null

    useEffect(() => {
        // On initial load, check localStorage for a logged-in user
        try {
            const sessionDataString = localStorage.getItem('user');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                // Check if the session has expired
                if (new Date().getTime() > sessionData.expiry) {
                    localStorage.removeItem('user'); // Clear expired session
                } else {
                    setUser(sessionData.userData);
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user'); // Clear corrupted data
        }
    }, []);

    const openLoginModal = () => setModalState('login');
    const openRegisterModal = () => setModalState('register');
    const openLogoutModal = () => setModalState('logout');
    const openAddChildModal = () => setModalState('addChild');
    const openForgotPasswordModal = () => setModalState('forgot');
    const closeModal = () => setModalState(null);

    const login = (userData) => {
        const sessionDataString = localStorage.getItem('user');
        if (sessionDataString) {
            // User is already logged in.
            // You might want to show a toast message here.
            return false;
        }
        // Store user data in localStorage and update state
        const sessionDuration = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
        const expiry = new Date().getTime() + sessionDuration;
        const sessionData = {
            userData: userData,
            expiry: expiry,
        };
        localStorage.setItem('user', JSON.stringify(sessionData));
        setUser(userData);
        closeModal();
        return true;
    };

    const logout = () => {
        // Remove user data from localStorage and state
        localStorage.clear();
        sessionStorage.clear();

        setUser(null);
        // Redirect to home page after logout for a clean state
        window.location.href = '/';
    };

    const value = {
        modalState,
        openLoginModal,
        openRegisterModal,
        openLogoutModal,
        openAddChildModal,
        openForgotPasswordModal,
        closeModal,
        user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
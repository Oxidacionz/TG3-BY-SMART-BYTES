import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    isDemoMode: boolean;
    showTutorial: boolean;
    login: () => void;
    demoLogin: () => void;
    logout: () => void;
    completeTutorial: () => void;
    restartTutorial: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // Check for stored session on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem('toro_auth');
        if (storedAuth === 'true') {
            setIsLoggedIn(true);
            const storedDemo = localStorage.getItem('toro_is_demo');
            if (storedDemo === 'true') {
                setIsDemoMode(true);
            }
        }
    }, []);

    // Check for tutorial on mount/login
    useEffect(() => {
        if (isLoggedIn) {
            const hasSeenTutorial = localStorage.getItem('hasSeenToroTutorial');
            if (!hasSeenTutorial) {
                setShowTutorial(true);
            }
        }
    }, [isLoggedIn]);

    const login = () => {
        setIsLoggedIn(true);
        localStorage.setItem('toro_auth', 'true');
        setIsDemoMode(false);
        localStorage.removeItem('toro_is_demo');
    };

    const demoLogin = () => {
        setIsDemoMode(true);
        setIsLoggedIn(true);
        localStorage.setItem('toro_auth', 'true');
        localStorage.setItem('toro_is_demo', 'true');
        setShowTutorial(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setIsDemoMode(false);
        localStorage.removeItem('toro_auth');
        localStorage.removeItem('toro_is_demo');
        // Ideally we shouldn't force reload, but to match original behavior or ensure clean state:
        // Window reload is sometimes used in legacy apps to clear memory. 
        // We will keep state driven for now, but original App.tsx had window.location.reload().
        // We will stick to Reat state for SPA best practices, unless refresh is needed for other reasons.
        // If we want to replicate the exact behavior of reload:
        window.location.reload();
    };

    const completeTutorial = () => {
        setShowTutorial(false);
        localStorage.setItem('hasSeenToroTutorial', 'true');
    };

    const restartTutorial = () => {
        setShowTutorial(true);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                isDemoMode,
                showTutorial,
                login,
                demoLogin,
                logout,
                completeTutorial,
                restartTutorial
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

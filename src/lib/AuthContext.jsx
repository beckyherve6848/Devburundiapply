import React, { createContext, useState, useContext, useEffect } from 'react';
import { client } from '@/api/client';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [appPublicSettings, setAppPublicSettings] = useState({ id: appParams.appId || 'devburundi', public_settings: {} });

    useEffect(() => {
        checkAppState();
    }, []);

    const checkAppState = async () => {
        try {
            setAuthError(null);
            await checkUserAuth();
        } catch (error) {
            console.error('Unexpected auth error:', error);
            setAuthError({
                type: 'unknown',
                message: error.message || 'An unexpected error occurred'
            });
        } finally {
            setIsLoadingPublicSettings(false);
            setIsLoadingAuth(false);
        }
    };

    const checkUserAuth = async () => {
        try {
            setIsLoadingAuth(true);
            const currentUser = await client.auth.me();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoadingAuth(false);
            setAuthChecked(true);
        } catch (error) {
            console.error('User auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
            setIsLoadingAuth(false);
            setAuthChecked(true);
        }
    };

    const logout = (shouldRedirect = true) => {
        setUser(null);
        setIsAuthenticated(false);
        client.auth.logout(shouldRedirect ? window.location.href : null);
    };

    const navigateToLogin = () => {
        client.auth.redirectToLogin(window.location.href);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoadingAuth,
            isLoadingPublicSettings,
            authError,
            appPublicSettings,
            authChecked,
            logout,
            navigateToLogin,
            checkUserAuth,
            checkAppState
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

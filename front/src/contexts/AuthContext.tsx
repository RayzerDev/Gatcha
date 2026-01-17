'use client';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {authService} from '@/lib/services';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier uniquement côté client
        if (typeof window === 'undefined') {
            return;
        }

        const checkAuth = async () => {
            const storedToken = authService.getToken();
            if (storedToken) {
                try {
                    const data = await authService.verify(storedToken);
                    if (data.status) {
                        setToken(storedToken);
                        setUsername(data.username);
                    } else {
                        authService.logout();
                    }
                } catch {
                    authService.logout();
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (newToken: string) => {
        const data = await authService.verify(newToken);
        if (data.status) {
            authService.logout(); // Nettoyer l'ancien token
            setToken(newToken);
            setUsername(data.username);
        } else {
            throw new Error('Invalid token');
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUsername(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

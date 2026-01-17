'use client';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {authApi, VerifyResponse} from '@/lib/api';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'gatcha_token';

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY);
        if (stored) {
            authApi
                .verify(stored)
                .then((data: VerifyResponse) => {
                    if (data.status) {
                        setToken(stored);
                        setUsername(data.username);
                    } else {
                        localStorage.removeItem(TOKEN_KEY);
                    }
                })
                .catch(() => {
                    localStorage.removeItem(TOKEN_KEY);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);
    const login = async (newToken: string) => {
        const data = await authApi.verify(newToken);
        if (data.status) {
            localStorage.setItem(TOKEN_KEY, newToken);
            setToken(newToken);
            setUsername(data.username);
        } else {
            throw new Error('Invalid token');
        }
    };
    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
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

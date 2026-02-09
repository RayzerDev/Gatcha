'use client';
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {ApiError, authService} from '@/lib/services';
import {TokenStorage} from '@/lib/TokenStorage';
import {authEvents} from '@/lib/AuthEvents';
import {useRouter} from 'next/navigation';

interface AuthContextType {
    token: string | null;
    username: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    handleUnauthorized: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Fonction pour gérer les 401
    const handleUnauthorized = useCallback(() => {
        TokenStorage.remove();
        setToken(null);
        setUsername(null);
        router.push('/login');
    }, [router]);

    useEffect(() => {
        // Vérifier uniquement côté client
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        const checkAuth = async () => {
            const storedToken = TokenStorage.get();

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await authService.verify(storedToken);
                if (data.status) {
                    setToken(storedToken);
                    setUsername(data.username);
                } else {
                    // Token invalide, le supprimer
                    TokenStorage.remove();
                }
            } catch (error) {
                // En cas d'erreur réseau, on garde le token et on réessaie plus tard
                // Sauf si c'est une erreur 401 (token expiré)
                let isUnauthorized = false;

                if (error instanceof ApiError) {
                    isUnauthorized = error.isAuthError();
                } else if (error instanceof Error) {
                    isUnauthorized = error.message.includes('401') || error.message.includes('Unauthorized');
                }

                if (isUnauthorized) {
                    TokenStorage.remove();
                    setToken(null);
                    setUsername(null);
                    router.push('/login');
                } else {
                    // Erreur réseau - garder le token pour retry
                    console.warn('Auth check failed, keeping token for retry:', error);
                    setToken(storedToken);
                    // On ne connaît pas le username, mais on est "connecté"
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const login = useCallback(async (newToken: string) => {
        try {
            const data = await authService.verify(newToken);
            if (data.status) {
                TokenStorage.set(newToken);
                setToken(newToken);
                setUsername(data.username);
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            TokenStorage.remove();
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        TokenStorage.remove();
        setToken(null);
        setUsername(null);
        router.push('/login');
    }, [router]);

    // Écouter les événements 401 de l'ApiClient
    useEffect(() => {
        return authEvents.onUnauthorized(() => {
            console.log('Received 401, logging out...');
            TokenStorage.remove();
            setToken(null);
            setUsername(null);
            router.push('/login');
        });
    }, [router]);

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
                handleUnauthorized,
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

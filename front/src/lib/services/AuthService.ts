import { TokenStorage } from '../TokenStorage';
import { BaseService } from './BaseService';
import { RegisterRequest, AuthResponse, LoginRequest, VerifyResponse } from '../types';

/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la vérification des tokens
 */
export class AuthService extends BaseService {
    /**
     * Inscription d'un nouvel utilisateur
     * Stocke automatiquement le token après inscription
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await this.client.post<AuthResponse>('/api/auth/users/register', data);

        // Stocker automatiquement le token
        TokenStorage.set(response.token);

        return response;
    }

    /**
     * Connexion d'un utilisateur existant
     * Stocke automatiquement le token après connexion
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await this.client.post<AuthResponse>('/api/auth/users/login', data);

        // Stocker automatiquement le token
        TokenStorage.set(response.token);

        return response;
    }

    /**
     * Vérification d'un token d'authentification
     * Utilise le token stocké si aucun token n'est fourni
     * Supprime le token si invalide
     */
    async verify(token?: string): Promise<VerifyResponse> {
        try {
            // Si pas de token fourni, récupérer depuis le stockage
            const authToken = token || TokenStorage.get();

            if (!authToken) {
                throw new Error('Aucun token disponible');
            }

            // Envoyer la requête avec Authorization header
            return await this.client.get<VerifyResponse>('/api/auth/tokens/verify', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        } catch (error) {
            // Si le token est invalide, le supprimer du stockage
            TokenStorage.remove();
            throw error;
        }
    }

    /**
     * Déconnexion de l'utilisateur
     * Supprime le token stocké
     */
    logout(): void {
        TokenStorage.remove();
    }

    /**
     * Vérifie si un utilisateur est connecté
     */
    isAuthenticated(): boolean {
        return TokenStorage.has();
    }

    /**
     * Récupère le token actuel
     */
    getToken(): string | null {
        return TokenStorage.get();
    }
}

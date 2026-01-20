import {ApiClient} from '../ApiClient';
import {TokenStorage} from '../TokenStorage';

// ============= Interfaces =============

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export interface VerifyResponse {
    status: boolean;
    username: string;
    message: string;
}

// ============= Service =============

/**
 * Service d'authentification
 * Gère l'inscription, la connexion et la vérification des tokens
 */
export class AuthService {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Inscription d'un nouvel utilisateur
     * Stocke automatiquement le token après inscription
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await this.client.post<AuthResponse>('/api/auth/users/register', data);

            // Stocker automatiquement le token
            TokenStorage.set(response.token);

            return response;
        } catch (error) {
            // Gérer les erreurs API spécifiques
            if (error instanceof Error) {
                throw error; // Re-lancer l'erreur avec le message approprié
            }
            throw new Error('Registration failed');
        }
    }

    /**
     * Connexion d'un utilisateur existant
     * Stocke automatiquement le token après connexion
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await this.client.post<AuthResponse>('/api/auth/users/login', data);

            // Stocker automatiquement le token
            TokenStorage.set(response.token);

            return response;
        } catch (error) {
            // Gérer les erreurs API spécifiques
            if (error instanceof Error) {
                throw error; // Re-lancer l'erreur avec le message approprié
            }
            throw new Error('Login failed');
        }
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
                throw new Error('No token available');
            }

            // Envoyer la requête avec Authorization header
            return await this.client.get<VerifyResponse>('/api/auth/tokens/verify', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        } catch (error) {
            // Si le token est invalide, le supprimer
            TokenStorage.remove();

            // Gérer les erreurs API spécifiques
            if (error instanceof Error) {
                throw error; // Re-lancer l'erreur avec le message approprié
            }
            throw new Error('Token verification failed');
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

import {ApiClient} from '../ApiClient';
import {TokenStorage} from '../TokenStorage';

/**
 * Classe de base pour tous les services API
 * Centralise la logique commune (headers d'authentification, client API)
 */
export abstract class BaseService {
    protected client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * Génère les headers d'authentification avec le token stocké
     */
    protected getAuthHeaders(): Record<string, string> {
        const token = TokenStorage.get();
        return token ? {Authorization: `Bearer ${token}`} : {};
    }

    /**
     * Helper pour les requêtes GET authentifiées
     */
    protected async getAuthenticated<T>(endpoint: string, additionalHeaders?: Record<string, string>): Promise<T> {
        return this.client.get<T>(endpoint, {
            headers: {...this.getAuthHeaders(), ...additionalHeaders},
        });
    }

    /**
     * Helper pour les requêtes POST authentifiées
     */
    protected async postAuthenticated<T>(
        endpoint: string,
        data?: unknown,
        additionalHeaders?: Record<string, string>
    ): Promise<T> {
        return this.client.post<T>(endpoint, data, {
            headers: {...this.getAuthHeaders(), ...additionalHeaders},
        });
    }

    /**
     * Helper pour les requêtes DELETE authentifiées
     */
    protected async deleteAuthenticated<T>(endpoint: string, additionalHeaders?: Record<string, string>): Promise<T> {
        return this.client.delete<T>(endpoint, {
            headers: {...this.getAuthHeaders(), ...additionalHeaders},
        });
    }

    /**
     * Helper pour les requêtes PUT authentifiées
     */
    protected async putAuthenticated<T>(
        endpoint: string,
        data?: unknown,
        additionalHeaders?: Record<string, string>
    ): Promise<T> {
        return this.client.put<T>(endpoint, data, {
            headers: {...this.getAuthHeaders(), ...additionalHeaders},
        });
    }

    /**
     * Helper pour les requêtes PATCH authentifiées
     */
    protected async patchAuthenticated<T>(
        endpoint: string,
        data?: unknown,
        additionalHeaders?: Record<string, string>
    ): Promise<T> {
        return this.client.patch<T>(endpoint, data, {
            headers: {...this.getAuthHeaders(), ...additionalHeaders},
        });
    }
}


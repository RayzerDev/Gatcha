import {ApiError} from "@/lib/ApiError";
import {authEvents} from "@/lib/AuthEvents";

export class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders,
        };
    }

    async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'GET',
            ...options,
        });
    }

    async post<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    async put<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }

    async patch<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = {
            ...this.defaultHeaders,
            ...(options.headers || {}),
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                await this.handleErrorResponse(response);
            }

            // Si pas de corps (204, etc.) retourner null/undefined selon le type attendu
            const text = await response.text();
            if (!text) {
                return null as unknown as T;
            }

            try {
                return JSON.parse(text) as T;
            } catch {
                // Si le corps n'est pas JSON, retourner le texte brut
                return text as unknown as T;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            // Erreur réseau ou autre pépin technique (ex: offline)
            throw new ApiError(
                'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
                0,
                error instanceof Error ? error.message : String(error)
            );
        }
    }

    private async handleErrorResponse(response: Response): Promise<never> {
        const isServerError = response.status >= 500;
        let errorDetails: unknown = null;
        let errorMessage = `Erreur HTTP ${response.status}`;

        if (response.status === 400) errorMessage = "Données invalides.";
        else if (response.status === 401) errorMessage = "Vous devez être connecté.";
        else if (response.status === 403) errorMessage = "Vous n'avez pas les droits nécessaires.";
        else if (response.status === 404) errorMessage = "Ressource introuvable.";
        else if (response.status === 409) errorMessage = "Un conflit est survenu (ex: nom déjà pris).";
        else if (response.status === 429) errorMessage = "Trop de tentatives. Veuillez patienter.";
        else if (response.status === 500) errorMessage = "Une erreur interne est survenue sur nos serveurs. Veuillez réessayer plus tard.";
        else if (response.status === 502) errorMessage = "Le service est temporairement inaccessible. Veuillez réessayer dans quelques instants.";
        else if (isServerError) errorMessage = "Nos serveurs rencontrent un problème passager. Veuillez réessayer plus tard.";

        // Si 401, émettre un événement pour déconnecter l'utilisateur
        if (response.status === 401) {
            authEvents.emitUnauthorized();
        }

        const text = await response.text();
        if (!text) {
            throw new ApiError(errorMessage, response.status, null);
        }

        let errorData: unknown;
        try {
            errorData = JSON.parse(text);
        } catch {
            // Si le corps n'est pas du JSON, on garde le message par défaut sauf si détail technique utile (mais on évite de l'afficher en brut user)
            throw new ApiError(errorMessage, response.status, text);
        }

        errorDetails = errorData;

        // Si le serveur renvoie un message spécifique précis (souvent le cas en 400/409 pour validation), on le privilégie
        // Mais pour les 500+, on force le message générique pour ne pas effrayer l'utilisateur avec des stacktraces
        if (!isServerError && typeof errorData === "object" && errorData !== null) {
            const rec = errorData as Record<string, unknown>;
            if (typeof rec.message === "string" && rec.message.trim()) {
                errorMessage = rec.message;
            } else if (typeof rec.error === "string" && rec.error.trim()) {
                errorMessage = rec.error;
            }
        } else if (!isServerError && typeof errorData === "string" && errorData.trim()) {
            errorMessage = errorData;
        }

        throw new ApiError(errorMessage, response.status, errorDetails);
    }

    setDefaultHeader(key: string, value: string): void {
        this.defaultHeaders[key] = value;
    }

    removeDefaultHeader(key: string): void {
        delete this.defaultHeaders[key];
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }
}
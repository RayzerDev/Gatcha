import {ApiError} from "@/lib/ApiError";

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

            throw new ApiError(
                'Network error or server unreachable',
                0,
                error instanceof Error ? error.message : String(error)
            );
        }
    }

    private async handleErrorResponse(response: Response): Promise<never> {
        const statusMsg = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails: unknown = null;

        const text = await response.text();
        if (!text) {
            throw new ApiError(statusMsg, response.status, null);
        }

        let errorData: unknown;
        try {
            errorData = JSON.parse(text);
        } catch {
            throw new ApiError(text, response.status, text);
        }

        errorDetails = errorData;

        if (typeof errorData === "object" && errorData !== null) {
            const rec = errorData as Record<string, unknown>;
            if (typeof rec.message === "string" && rec.message.trim()) {
                throw new ApiError(rec.message, response.status, errorDetails);
            }
            if (typeof rec.error === "string" && rec.error.trim()) {
                throw new ApiError(rec.error, response.status, errorDetails);
            }
        }

        if (typeof errorData === "string" && errorData.trim()) {
            throw new ApiError(errorData, response.status, errorDetails);
        }

        throw new ApiError(statusMsg, response.status, errorDetails);
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
/**
 * Service de gestion sécurisée des tokens d'authentification
 * Utilise des cookies sécurisés + sessionStorage comme fallback
 */
export class TokenStorage {
    private static readonly TOKEN_KEY = 'gatcha_token';

    /**
     * Récupère le token stocké
     * Essaie d'abord le cookie, puis sessionStorage
     */
    static get(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        // Essayer de récupérer depuis le cookie
        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            const tokenCookie = cookies.find(c => c.trim().startsWith(`${this.TOKEN_KEY}=`));
            if (tokenCookie) {
                return tokenCookie.split('=')[1];
            }

            // Fallback: sessionStorage (pour la compatibilité)
            return sessionStorage.getItem(this.TOKEN_KEY);
        }

        return null;
    }

    /**
     * Stocke le token de manière sécurisée
     * Cookie Secure + SameSite + sessionStorage fallback
     * Pas de max-age car le token backend est renouvelé automatiquement (now + 1h)
     */
    static set(token: string): void {
        if (typeof window === 'undefined') {
            return;
        }

        if (typeof document !== 'undefined') {
            // Cookie avec attributs de sécurité
            const isProduction = process.env.NODE_ENV === 'production';
            const secure = isProduction ? 'Secure;' : '';

            // Session cookie (pas de max-age) car le token backend est auto-renouvelé
            document.cookie = `${this.TOKEN_KEY}=${token}; path=/; ${secure} SameSite=Strict`;

            // Fallback sessionStorage
            sessionStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    /**
     * Supprime le token stocké
     */
    static remove(): void {
        if (typeof window === 'undefined') {
            return;
        }

        if (typeof document !== 'undefined') {
            // Supprimer le cookie
            document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            // Supprimer du sessionStorage
            sessionStorage.removeItem(this.TOKEN_KEY);
        }
    }

    /**
     * Vérifie si un token est présent
     */
    static has(): boolean {
        return this.get() !== null;
    }
}

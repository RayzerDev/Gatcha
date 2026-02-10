/**
 * Service de gestion sécurisée des tokens d'authentification
 * Utilise des cookies sécurisés + sessionStorage comme fallback
 */
export class TokenStorage {
    private static readonly TOKEN_KEY = 'gatcha_token';
    private static readonly USERNAME_KEY = 'gatcha_username';

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
     * Récupère le nom d'utilisateur stocké
     */
    static getUsername(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';');
            const userCookie = cookies.find(c => c.trim().startsWith(`${this.USERNAME_KEY}=`));
            if (userCookie) {
                return decodeURIComponent(userCookie.split('=')[1]);
            }

            return sessionStorage.getItem(this.USERNAME_KEY);
        }

        return null;
    }

    /**
     * Stocke le token de manière sécurisée
     * Cookie Secure + SameSite + sessionStorage fallback
     * Pas de max-age car le token backend est renouvelé automatiquement (now + 1h)
     */
    static set(token: string, username?: string): void {
        if (typeof window === 'undefined') {
            return;
        }

        if (typeof document !== 'undefined') {
            // Cookie avec attributs de sécurité
            const isProduction = process.env.NODE_ENV === 'production';
            const secure = isProduction ? 'Secure;' : '';

            // Session cookie
            document.cookie = `${this.TOKEN_KEY}=${token}; path=/; ${secure} SameSite=Strict`;
            sessionStorage.setItem(this.TOKEN_KEY, token);

            if (username) {
                document.cookie = `${this.USERNAME_KEY}=${encodeURIComponent(username)}; path=/; ${secure} SameSite=Strict`;
                sessionStorage.setItem(this.USERNAME_KEY, username);
            }
        }
    }

    /**
     * Supprime le token et le username stockés
     */
    static remove(): void {
        if (typeof window === 'undefined') {
            return;
        }

        if (typeof document !== 'undefined') {
            // Supprimer le cookie token
            document.cookie = `${this.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            // Supprimer le cookie username
            document.cookie = `${this.USERNAME_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

            // Supprimer du sessionStorage
            sessionStorage.removeItem(this.TOKEN_KEY);
            sessionStorage.removeItem(this.USERNAME_KEY);
        }
    }

    /**
     * Vérifie si un token est présent
     */
    static has(): boolean {
        return this.get() !== null;
    }
}

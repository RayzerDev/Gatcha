/**
 * Event émetteur simple pour la communication entre ApiClient et React
 */
type AuthEventListener = () => void;

class AuthEventEmitter {
    private listeners: AuthEventListener[] = [];

    /**
     * Écouter les événements d'authentification expirée
     */
    onUnauthorized(listener: AuthEventListener): () => void {
        this.listeners.push(listener);
        // Retourner une fonction de désinscription
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Émettre un événement d'authentification expirée
     */
    emitUnauthorized(): void {
        this.listeners.forEach(listener => listener());
    }
}

// Singleton pour l'application
export const authEvents = new AuthEventEmitter();

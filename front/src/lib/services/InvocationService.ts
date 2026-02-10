import { BaseService } from './BaseService';
import { Invocation, MonsterTemplate } from '../types';

export class InvocationService extends BaseService {
    /**
     * Effectue une invocation pour obtenir un nouveau monstre
     */
    async invoke(): Promise<Invocation> {
        return this.postAuthenticated<Invocation>('/api/invocation/invocations');
    }

    /**
     * Récupère l'historique des invocations du joueur
     */
    async getHistory(): Promise<Invocation[]> {
        return this.getAuthenticated<Invocation[]>('/api/invocation/invocations');
    }

    /**
     * Récupère tous les templates de monstres disponibles
     */
    async getTemplates(): Promise<MonsterTemplate[]> {
        return this.getAuthenticated<MonsterTemplate[]>('/api/invocation/invocations/templates');
    }

    /**
     * Rejoue les invocations échouées
     */
    async retryFailed(): Promise<Invocation[]> {
        return this.postAuthenticated<Invocation[]>('/api/invocation/invocations/retry');
    }
}

import { BaseService } from './BaseService';
import { Combat, CombatSummary } from '../types';

export class CombatService extends BaseService {
    /**
     * Lance un combat entre deux monstres
     */
    async startCombat(monster1Id: string, monster2Id: string): Promise<Combat> {
        return this.postAuthenticated<Combat>('/api/combat/combats', {
            monster1Id,
            monster2Id
        });
    }

    /**
     * Récupère l'historique des combats du joueur connecté
     */
    async getMyHistory(): Promise<CombatSummary[]> {
        return this.getAuthenticated<CombatSummary[]>('/api/combat/combats/me');
    }

    /**
     * Récupère un combat par son ID (pour la rediffusion)
     */
    async getCombat(id: string): Promise<Combat> {
        return this.getAuthenticated<Combat>(`/api/combat/combats/${id}`);
    }
}

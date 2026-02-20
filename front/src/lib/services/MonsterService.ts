import {BaseService} from './BaseService';
import {Monster} from '../types';

export class MonsterService extends BaseService {
    /**
     * Récupère tous les monstres du joueur connecté
     */
    async getMyMonsters(): Promise<Monster[]> {
        return this.getAuthenticated<Monster[]>('/api/monster/monsters');
    }

    /**
     * Récupère un monstre par son ID
     */
    async getMonster(id: string): Promise<Monster> {
        return this.getAuthenticated<Monster>(`/api/monster/monsters/${id}`);
    }

    /**
     * Ajoute de l'expérience à un monstre
     */
    async addExperience(monsterId: string, amount: number): Promise<Monster> {
        return this.postAuthenticated<Monster>(
            `/api/monster/monsters/${monsterId}/experience?amount=${amount}`
        );
    }

    /**
     * Améliore une compétence d'un monstre
     */
    async upgradeSkill(monsterId: string, skillNum: number): Promise<Monster> {
        return this.postAuthenticated<Monster>(
            `/api/monster/monsters/${monsterId}/skills/${skillNum}/upgrade`
        );
    }

    /**
     * Supprime un monstre
     */
    async deleteMonster(monsterId: string): Promise<void> {
        return this.deleteAuthenticated<void>(`/api/monster/monsters/${monsterId}`);
    }
}

import { BaseService } from './BaseService';
import { Player } from '../types';

export class PlayerService extends BaseService {
    /**
     * Récupère les informations du joueur
     */
    async getPlayer(username: string): Promise<Player> {
        return this.getAuthenticated<Player>(`/api/player/players/${username}`);
    }

    /**
     * Récupère le niveau du joueur
     */
    async getPlayerLevel(username: string): Promise<number> {
        return this.getAuthenticated<number>(`/api/player/players/${username}/level`);
    }

    /**
     * Récupère les IDs des monstres du joueur
     */
    async getPlayerMonsters(username: string): Promise<string[]> {
        return this.getAuthenticated<string[]>(`/api/player/players/${username}/monsters`);
    }

    /**
     * Ajoute de l'expérience au joueur
     */
    async addExperience(username: string, amount: number): Promise<Player> {
        return this.postAuthenticated<Player>(
            `/api/player/players/${username}/experience?amount=${amount}`
        );
    }

    /**
     * Monte le joueur de niveau
     */
    async levelUp(username: string): Promise<Player> {
        return this.postAuthenticated<Player>(`/api/player/players/${username}/level-up`);
    }
}

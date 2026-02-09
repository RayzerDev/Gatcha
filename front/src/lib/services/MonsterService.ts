import {ApiClient} from '../ApiClient';
import {TokenStorage} from '../TokenStorage';

// ============= Interfaces =============

export interface Skill {
    num: number;
    dmg: number;
    ratio: {
        stat: string;
        percent: number;
    };
    cooldown: number;
    lvl: number;
    lvlMax: number;
}

export interface Monster {
    id: string;
    templateId: number;
    ownerUsername: string;
    element: 'fire' | 'water' | 'wind';
    hp: number;
    atk: number;
    def: number;
    vit: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    skillPoints: number;
    skills: Skill[];
}

// ============= Service =============

export class MonsterService {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = TokenStorage.get();
        return token ? {Authorization: `Bearer ${token}`} : {};
    }

    /**
     * Récupère tous les monstres du joueur connecté
     */
    async getMyMonsters(): Promise<Monster[]> {
        return this.client.get<Monster[]>('/api/monster/monsters', {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Récupère un monstre par son ID
     */
    async getMonster(id: string): Promise<Monster> {
        return this.client.get<Monster>(`/api/monster/monsters/${id}`, {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Ajoute de l'expérience à un monstre
     */
    async addExperience(monsterId: string, amount: number): Promise<Monster> {
        return this.client.post<Monster>(
            `/api/monster/monsters/${monsterId}/experience?amount=${amount}`,
            undefined,
            {headers: this.getAuthHeaders()}
        );
    }

    /**
     * Améliore une compétence d'un monstre
     */
    async upgradeSkill(monsterId: string, skillNum: number): Promise<Monster> {
        return this.client.post<Monster>(
            `/api/monster/monsters/${monsterId}/skills/${skillNum}/upgrade`,
            undefined,
            {headers: this.getAuthHeaders()}
        );
    }

    /**
     * Supprime un monstre
     */
    async deleteMonster(monsterId: string): Promise<void> {
        return this.client.delete<void>(`/api/monster/monsters/${monsterId}`, {
            headers: this.getAuthHeaders(),
        });
    }
}

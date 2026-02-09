import { ApiClient } from '../ApiClient';
import { TokenStorage } from '../TokenStorage';

// ============= Interfaces =============

export interface Player {
    id: string;
    username: string;
    level: number;
    experience: number;
    experienceStep: number;
    monsters: string[];
    maxMonsters: number;
}

// ============= Service =============

export class PlayerService {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = TokenStorage.get();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Récupère les informations du joueur
     */
    async getPlayer(username: string): Promise<Player> {
        return this.client.get<Player>(`/api/player/players/${username}`, {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Récupère le niveau du joueur
     */
    async getPlayerLevel(username: string): Promise<number> {
        return this.client.get<number>(`/api/player/players/${username}/level`, {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Récupère les IDs des monstres du joueur
     */
    async getPlayerMonsters(username: string): Promise<string[]> {
        return this.client.get<string[]>(`/api/player/players/${username}/monsters`, {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Ajoute de l'expérience au joueur
     */
    async addExperience(username: string, amount: number): Promise<Player> {
        return this.client.post<Player>(
            `/api/player/players/${username}/experience?amount=${amount}`,
            undefined,
            { headers: this.getAuthHeaders() }
        );
    }

    /**
     * Monte le joueur de niveau
     */
    async levelUp(username: string): Promise<Player> {
        return this.client.post<Player>(
            `/api/player/players/${username}/level-up`,
            undefined,
            { headers: this.getAuthHeaders() }
        );
    }
}

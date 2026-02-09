import { ApiClient } from '../ApiClient';
import { TokenStorage } from '../TokenStorage';

// ============= Interfaces =============

export interface MonsterTemplate {
    id: number;
    element: 'FIRE' | 'WATER' | 'WIND';
    hp: number;
    atk: number;
    def: number;
    vit: number;
    skills: {
        num: number;
        dmg: number;
        ratio: {
            stat: string;
            percent: number;
        };
        cooldown: number;
        lvlMax: number;
    }[];
    lootRate: number;
}

export interface Invocation {
    id: string;
    username: string;
    templateId: number;
    monsterId: string | null;
    status: 'PENDING' | 'MONSTER_CREATED' | 'PLAYER_UPDATED' | 'COMPLETED' | 'FAILED';
    createdAt: string;
}

// ============= Service =============

export class InvocationService {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    private getAuthHeaders(): Record<string, string> {
        const token = TokenStorage.get();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    /**
     * Effectue une invocation pour obtenir un nouveau monstre
     */
    async invoke(): Promise<Invocation> {
        return this.client.post<Invocation>('/api/invocation/invocations', undefined, {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Récupère l'historique des invocations du joueur
     */
    async getHistory(): Promise<Invocation[]> {
        return this.client.get<Invocation[]>('/api/invocation/invocations', {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Récupère tous les templates de monstres disponibles
     */
    async getTemplates(): Promise<MonsterTemplate[]> {
        return this.client.get<MonsterTemplate[]>('/api/invocation/invocations/templates', {
            headers: this.getAuthHeaders(),
        });
    }

    /**
     * Rejoue les invocations échouées
     */
    async retryFailed(): Promise<Invocation[]> {
        return this.client.post<Invocation[]>('/api/invocation/invocations/retry', undefined, {
            headers: this.getAuthHeaders(),
        });
    }
}

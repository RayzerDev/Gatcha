// ============= Auhtentication Types =============
export interface RegisterRequest {
    username: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    message: string;
}

export interface VerifyResponse {
    status: boolean;
    username: string;
    message: string;
}

// ============= Monster Types =============

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

// ============= Invocation Types =============

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

// ============= Player Types =============

export interface Player {
    id: string;
    username: string;
    level: number;
    experience: number;
    experienceStep: number;
    monsters: string[];
    maxMonsters: number;
}


// ============= Authentication Types =============
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

export enum ElementEnum {
    fire = 'fire',
    water = 'water',
    wind = 'wind'
}

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
    element: ElementEnum;
    hp: number;
    atk: number;
    def: number;
    vit: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
    skillPoints: number;
    skills: Skill[];
    xp: number;
}

export interface Booster {
    id: number;
    name: string;
    description: string;
    price: number;
    rates?: {
        common: number;
        rare: number;
        epic: number;
        legendary: number;
    };
}

export interface MonsterTemplate {
    id: number;
    element: ElementEnum;
    hp: number;
    atk: number;
    def: number;
    vit: number;
    skills: Skill[];
    lootRate: number;
    boosterId?: number;
}

export enum InvocationStatus {
    PENDING = 'PENDING',
    MONSTER_CREATED = 'MONSTER_CREATED',
    PLAYER_UPDATED = 'PLAYER_UPDATED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface Invocation {
    id: string;
    username: string;
    templateId: number;
    monsterId: string | null;
    status: InvocationStatus;
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


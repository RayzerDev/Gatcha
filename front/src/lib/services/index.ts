import {ApiClient} from '../ApiClient';
import {AuthService} from './AuthService';
import {MonsterService} from './MonsterService';
import {InvocationService} from './InvocationService';
import {PlayerService} from './PlayerService';
import {CombatService} from './CombatService';

// ============= Configuration =============

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============= Instances des services =============

/**
 * Client HTTP partagé pour tous les services
 */
export const apiClient = new ApiClient(API_BASE);

/**
 * Service d'authentification (singleton)
 */
export const authService = new AuthService(apiClient);

/**
 * Service de gestion des monstres (singleton)
 */
export const monsterService = new MonsterService(apiClient);

/**
 * Service d'invocation (singleton)
 */
export const invocationService = new InvocationService(apiClient);

/**
 * Service de gestion des joueurs (singleton)
 */
export const playerService = new PlayerService(apiClient);

/**
 * Service de gestion des combats (singleton)
 */
export const combatService = new CombatService(apiClient);

// ============= Exports =============

// Exporter les types
export type {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    VerifyResponse,
    Monster,
    Skill,
    Invocation,
    MonsterTemplate,
    Player,
    Combat,
    CombatLog,
    CombatMonsterSnapshot,
    CombatSummary,
    SkillSnapshot
} from '../types';

export {AuthService} from './AuthService';
export {BaseService} from './BaseService';
export {CombatService} from './CombatService';
export {ApiClient} from '../ApiClient';
export {ApiError} from '../ApiError';
export {TokenStorage} from '../TokenStorage';
export {authEvents} from '../AuthEvents';

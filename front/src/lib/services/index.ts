import {ApiClient} from '../ApiClient';
import {AuthService} from './AuthService';
import {MonsterService} from './MonsterService';
import {InvocationService} from './InvocationService';
import {PlayerService} from './PlayerService';

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

// ============= Exports =============

// Exporter les types Auth
export type {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    VerifyResponse,
} from './AuthService';

// Exporter les types Monster
export type {Monster, Skill} from './MonsterService';

// Exporter les types Invocation
export type {Invocation, MonsterTemplate} from './InvocationService';

// Exporter les types Player
export type {Player} from './PlayerService';
export {AuthService} from './AuthService';
export {ApiClient} from '../ApiClient';
export {ApiError} from '../ApiError';
export {TokenStorage} from '../TokenStorage';
export {authEvents} from '../AuthEvents';

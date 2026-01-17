import {ApiClient} from '../ApiClient';
import {AuthService} from './AuthService';

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

// ============= Exports =============

// Exporter les types
export type {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    VerifyResponse,
} from './AuthService';

// Exporter les classes pour permettre l'extension
export {AuthService} from './AuthService';
export {ApiClient} from '../ApiClient';
export {ApiError} from '../ApiError';
export {TokenStorage} from '../TokenStorage';

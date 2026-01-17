// Services API pour l'authentification via la gateway
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export const authApi = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/api/auth/users/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({message: 'Registration failed'}));
            throw new Error(error.message || `Error ${res.status}`);
        }

        return res.json();
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const res = await fetch(`${API_BASE}/api/auth/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({message: 'Login failed'}));
            throw new Error(error.message || `Error ${res.status}`);
        }

        return res.json();
    },

    async verify(token: string): Promise<VerifyResponse> {
        const res = await fetch(`${API_BASE}/api/auth/tokens/verify?token=${encodeURIComponent(token)}`, {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error('Token invalid or expired');
        }

        return res.json();
    },
};

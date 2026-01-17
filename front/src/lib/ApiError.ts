export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly details: unknown;

    constructor(message: string, statusCode: number, details?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    isAuthError(): boolean {
        return this.statusCode === 401;
    }

    isValidationError(): boolean {
        return this.statusCode === 400;
    }

    isConflictError(): boolean {
        return this.statusCode === 409;
    }

    isServerError(): boolean {
        return this.statusCode >= 500 && this.statusCode < 600;
    }
}

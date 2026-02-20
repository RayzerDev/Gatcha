'use client';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export function LoadingSpinner({size = 'md', message}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent`}
            />
            {message && (
                <p className="mt-4 text-zinc-600 dark:text-zinc-400">{message}</p>
            )}
        </div>
    );
}

interface LoadingPageProps {
    message?: string;
}

export function LoadingPage({message = 'Chargement...'}: LoadingPageProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
            <LoadingSpinner size="lg" message={message}/>
        </div>
    );
}

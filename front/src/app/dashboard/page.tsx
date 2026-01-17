'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function DashboardPage() {
    const {username, isAuthenticated, isLoading, logout} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                <div className="text-center">
                    <div
                        className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            <nav className="bg-white shadow dark:bg-zinc-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Gatcha Game</h1>
                        </div>
                        <div className="flex items-center space-x-4">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Welcome, <span className="font-semibold">{username}</span>
              </span>
                            <button
                                onClick={logout}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h2>
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                        You are successfully authenticated!
                    </p>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300">Authentication Status</h3>
                            <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
                                <li>✓ Authenticated as <strong>{username}</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

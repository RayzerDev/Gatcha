'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

interface NavbarProps {
    username: string | null;
    onLogout: () => void;
}

export function Navbar({username, onLogout}: NavbarProps) {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-40 bg-white/80 shadow backdrop-blur-lg dark:bg-zinc-800/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-2xl">🎮</span>
                            <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Gatcha Game
                            </h1>
                        </Link>

                        <div className="hidden md:flex gap-4">
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === '/dashboard'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/templates"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    pathname === '/templates'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                Templates (Admin)
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            Bienvenue, <span className="font-semibold">{username}</span>
                        </span>
                        <button
                            onClick={onLogout}
                            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

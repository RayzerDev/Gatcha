'use client';

import {useAuth} from '@/contexts/AuthContext';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {Gamepad2, Home, LogOut, Settings, Swords} from 'lucide-react';

export function Navbar() {
    const {username, logout} = useAuth();
    const pathname = usePathname();

    return (
        <nav
            className="sticky top-0 z-40 bg-white/80 shadow backdrop-blur-lg dark:bg-gray-900/80 border-b border-zinc-800/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Gamepad2 className="text-purple-600" size={28}/>
                            <h1 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Gatcha Game
                            </h1>
                        </Link>

                        <div className="hidden md:flex gap-4">
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                    pathname === '/dashboard'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                <Home size={16}/> Dashboard
                            </Link>
                            <Link
                                href="/combat"
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                    pathname?.startsWith('/combat')
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                <Swords size={16}/>
                                Combats
                            </Link>
                            <Link
                                href="/templates"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors opacity-60 flex items-center gap-2 ${
                                    pathname === '/templates'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                <Settings size={16}/> Admin
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">
                            Bonjour, <strong>{username}</strong>
                        </span>
                        <button
                            onClick={logout}
                            className="rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 flex items-center gap-2"
                        >
                            <LogOut size={16}/> Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

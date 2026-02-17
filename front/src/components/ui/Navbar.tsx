'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const { username, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();

    if (!isAuthenticated) return null;

    return (
        <nav className="sticky top-0 z-40 bg-zinc-900/80 shadow-lg backdrop-blur-lg border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl filter drop-shadow-lg">🎮</span>
                            <span className="text-xl font-black bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                GATCHA
                            </span>
                        </div>
                        
                        {/* Navigation Links */}
                        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                            <Link 
                                href="/dashboard" 
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                    pathname === '/dashboard' 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                href="/combat" 
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                    pathname?.startsWith('/combat')
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>⚔️</span>
                                Combats
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                            <span className="text-sm font-medium text-zinc-300">
                                {username}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            title="Se déconnecter"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

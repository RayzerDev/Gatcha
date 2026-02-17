'use client';

import { useEffect, useState, use } from 'react';
import { combatService } from '@/lib/services';
import { Combat } from '@/lib/types';
import { CombatArena } from '@/components/combat/CombatArena';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CombatReplayPage({ params }: PageProps) {
    // Unwrap params in Next.js 16+ using React.use()
    const { id } = use(params);

    const [combat, setCombat] = useState<Combat | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadCombat(id);
        }
    }, [id]);

    const loadCombat = async (combatId: string) => {
        try {
            setLoading(true);
            const data = await combatService.getCombat(combatId);
            setCombat(data);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger la rediffusion.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-zinc-900 via-purple-900/20 to-zinc-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                     <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                     <span className="text-zinc-500 font-medium animate-pulse">Chargement du replay...</span>
                </div>
            </div>
        );
    }

    if (error || !combat) {
        return (
            <div className="min-h-screen bg-linear-to-br from-zinc-900 via-purple-900/20 to-zinc-900 flex items-center justify-center p-4">
                <div className="rounded-2xl bg-zinc-900 border border-white/10 p-8 text-center max-w-md w-full backdrop-blur-sm shadow-xl">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-white mb-2">{error || "Combat introuvable"}</h3>
                    <p className="text-zinc-400 mb-6">Le combat que vous cherchez n'existe pas ou a été supprimé.</p>
                    <Link 
                        href="/combat/history" 
                        className="inline-block w-full rounded-xl bg-purple-600 px-4 py-3 font-bold text-white hover:bg-purple-500 transition-colors"
                    >
                        Retour à l'historique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-zinc-900 via-purple-900/20 to-zinc-900">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link 
                        href="/combat/history"
                        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                    >
                        <span>←</span> Retour à l'historique
                    </Link>
                    <h1 className="text-2xl font-black italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                        REPLAY
                    </h1>
                </div>

                <div className="rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl animate-fadeInUp">
                    <CombatArena combat={combat} />
                </div>
            </main>
        </div>
    );
}


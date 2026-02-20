'use client';

import {useEffect, useState} from 'react';
import {combatService, CombatSummary} from '@/lib/services';
import Link from 'next/link';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import {ArrowLeft, ArrowRight, Calendar, ChevronLeft, ChevronRight, ScrollText, Swords} from 'lucide-react';

// Ensure CombatSummary type is correct or define it locally if needed
// based on previous file content, it was imported.

export default function CombatHistoryPage() {
    const [combats, setCombats] = useState<CombatSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await combatService.getMyHistory();
            setCombats(data);
        } catch (err) {
            console.error('Failed to load history', err);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(combats.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedCombats = combats.slice(startIndex, startIndex + ITEMS_PER_PAGE);


    return (
        <div className="h-full flex flex-col">
            <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 flex flex-col">
                <div className="mb-8 flex items-center justify-between shrink-0">
                    <Link
                        href="/combat"
                        className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                    >
                        <ArrowLeft className="w-4 h-4"/> Retour à l&#39;arène
                    </Link>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20}/>
                            </button>
                            <span className="text-sm text-zinc-400 font-medium">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}

                    <h1 className="text-3xl font-black italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                        HISTORIQUE
                    </h1>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div
                            className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                    </div>
                ) : combats.length === 0 ? (
                    <div
                        className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center backdrop-blur-sm animate-fadeInUp">
                        <div className="mb-4 flex justify-center opacity-50">
                            <ScrollText className="w-24 h-24"/>
                        </div>
                        <p className="text-xl font-bold text-white mb-2">Aucun combat enregistré</p>
                        <p className="text-zinc-400">
                            Lancez un combat d&#39;entraînement pour voir votre historique ici !
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                            <div className="grid gap-4 animate-fadeInUp">
                                {displayedCombats.map((combat, index) => {
                                    // Defensive coding for dates
                                    let dateStr = 'Date inconnue';
                                    try {
                                        if (combat.createdAt) {
                                            dateStr = format(new Date(combat.createdAt), "d MMMM yyyy 'à' HH:mm", {locale: fr});
                                        }
                                    } catch (e) {
                                        console.error('Date parsing error', e);
                                    }

                                    return (
                                        <Link
                                            key={combat.id || index}
                                            href={`/combat/history/${combat.id}`}
                                            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 p-6 transition-all hover:bg-zinc-800/80 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 active:scale-[0.99]"
                                        >
                                            <div
                                                className="absolute inset-0 bg-linear-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"/>

                                            <div className="relative flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-6">
                                                    <div
                                                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-3xl shadow-inner group-hover:scale-110 transition-transform">
                                                        <Swords className="w-8 h-8"/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span
                                                                className="font-black text-lg text-white group-hover:text-purple-300 transition-colors">
                                                                Combat #{combat.id?.substring(0, 8)}...
                                                            </span>
                                                            <span
                                                                className="px-2 py-0.5 rounded text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                                                {combat.totalTurns || '?'} tours
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-zinc-500 flex items-center gap-2">
                                                            <Calendar className="w-4 h-4"/> {dateStr}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right hidden sm:block">
                                                        <div
                                                            className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">
                                                            Monstres
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-purple-500"/>
                                                            <span className="text-sm font-medium text-zinc-300">
                                                                Monstre 1
                                                            </span>
                                                            <span className="text-zinc-600">vs</span>
                                                            <span className="text-sm font-medium text-zinc-300">
                                                                Monstre 2
                                                            </span>
                                                            <div className="h-2 w-2 rounded-full bg-pink-500"/>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                                        <ArrowRight className="w-5 h-5"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import {useEffect, useMemo, useState} from 'react';
import {combatService, monsterService} from '@/lib/services';
import {Combat, Monster} from '@/lib/types';
import {MonsterCard} from '@/components/monsters/MonsterCard';
import {CombatArena} from '@/components/combat/CombatArena';
import {ArrowLeft, ChevronLeft, ChevronRight, Ghost, ScrollText, Swords} from 'lucide-react';
import Link from "next/link";

export default function CombatPage() {
    const [monsters, setMonsters] = useState<Monster[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    // Selection state for 2 monsters
    const [selectedId1, setSelectedId1] = useState<string | null>(null);
    const [selectedId2, setSelectedId2] = useState<string | null>(null);

    const [activeCombat, setActiveCombat] = useState<Combat | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Particles for background effect
    const particles = useMemo(() => {
        return Array.from({length: 20}, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 3 + Math.random() * 4
        }));
    }, []);

    // Load monsters on mount
    useEffect(() => {
        loadMonsters();
    }, []);

    const loadMonsters = async () => {
        try {
            setLoading(true);
            const data = await monsterService.getMyMonsters();
            setMonsters(data);
        } catch (err) {
            console.error('Failed to load monsters', err);
            setError("Impossible de charger vos monstres.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id: string) => {
        if (selectedId1 === id) {
            setSelectedId1(null);
        } else if (selectedId2 === id) {
            setSelectedId2(null);
        } else if (!selectedId1) {
            setSelectedId1(id);
        } else if (!selectedId2) {
            setSelectedId2(id);
        } else {
            // Both full, maybe replace the second one?
            setSelectedId2(id);
        }
    };

    const handleStartCombat = async () => {
        if (!selectedId1 || !selectedId2) return;

        try {
            setStarting(true);
            setError(null);
            const combat = await combatService.startCombat(selectedId1, selectedId2);
            setActiveCombat(combat);
        } catch (err) {
            console.error('Combat start failed', err);
            setError("Échec du lancement du combat. Réessayez plus tard.");
        } finally {
            setStarting(false);
        }
    };

    const handleBackToLobby = () => {
        setActiveCombat(null);
        setSelectedId1(null);
        setSelectedId2(null);
        // Reload monsters to see XP changes
        loadMonsters();
    };

    // Pagination logic
    const totalPages = Math.ceil(monsters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedMonsters = monsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (activeCombat) {
        return (
            <div className="h-full flex flex-col">
                <div className="mx-auto w-full max-w-360 flex-1 px-2 sm:px-4 py-2 flex flex-col h-full">
                    <div className="mb-2 flex items-center justify-between shrink-0">
                        <button
                            onClick={handleBackToLobby}
                            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs sm:text-sm font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-4 h-4"/> Retour au lobby
                        </button>
                    </div>

                    <div
                        className="flex-1 rounded-2xl sm:rounded-3xl bg-black/40 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl relative flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4 touch-pan-y">
                            <CombatArena combat={activeCombat}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Particles Background */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-red-500/20 animate-float"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`
                        }}
                    />
                ))}
            </div>

            <main className="mx-auto max-w-360 px-4 py-8 sm:px-6 lg:px-8 relative z-10">

                {/* Header Section */}
                <div className="mb-12 text-center animate-fadeInUp">
                    <div
                        className="inline-block p-3 rounded-2xl bg-linear-to-br from-red-500/20 to-purple-500/20 ring-1 ring-white/10 backdrop-blur-sm mb-6">
                        <Swords className="w-10 h-10 text-red-400"/>
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-red-400 via-purple-400 to-pink-400 sm:text-6xl drop-shadow-sm mb-4">
                        ARÈNE D&#39;ENTRAÎNEMENT
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-4xl mx-auto mb-8">
                        Sélectionnez deux monstres de votre collection pour lancer un combat simulé et gagner de
                        l&#39;expérience.
                    </p>

                    <Link
                        href="/combat/history"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white font-medium transition-all border border-white/10"
                    >
                        <ScrollText className="w-5 h-5"/> Voir l&#39;historique des combats
                    </Link>
                </div>

                {error && (
                    <div
                        className="mb-8 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-red-400 backdrop-blur-sm animate-shake">
                        {error}
                    </div>
                )}

                {/* Selection & Action Bar */}
                {!loading && monsters.length > 0 && (
                    <div className="sticky top-0 z-30 mb-12 -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="mx-auto max-w-2xl">
                            <div
                                className="relative rounded-2xl bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-xl border border-white/10 ring-1 ring-black/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeInUp"
                                style={{animationDelay: '0.1s'}}>

                                {/* 1 vs 2 Selection Area */}
                                <div className="flex items-center justify-center gap-6 w-full md:w-auto flex-1">
                                    {/* Slot 1 */}
                                    <div
                                        className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedId1 ? 'scale-110' : 'opacity-50'}`}>
                                        <div
                                            className={`h-16 w-16 rounded-2xl border-2 ${selectedId1 ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-zinc-700 bg-zinc-800'} flex items-center justify-center relative overflow-hidden`}>
                                            {selectedId1 ? (
                                                // Find monster image content here if we had access to it easily,
                                                // for now just color/number
                                                <div
                                                    className="absolute inset-0 bg-purple-600 flex items-center justify-center text-2xl font-black text-white">
                                                    1
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600 font-bold text-xl">1</span>
                                            )}
                                        </div>
                                        <div className="h-1.5 w-8 rounded-full bg-purple-500/50"></div>
                                    </div>

                                    {/* VS Badge */}
                                    <div className="flex flex-col items-center">
                                        <span
                                            className="text-3xl font-black italic text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500">VS</span>
                                    </div>

                                    {/* Slot 2 */}
                                    <div
                                        className={`flex flex-col items-center gap-2 transition-all duration-300 ${selectedId2 ? 'scale-110' : 'opacity-50'}`}>
                                        <div
                                            className={`h-16 w-16 rounded-2xl border-2 ${selectedId2 ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'border-zinc-700 bg-zinc-800'} flex items-center justify-center relative overflow-hidden`}>
                                            {selectedId2 ? (
                                                <div
                                                    className="absolute inset-0 bg-pink-600 flex items-center justify-center text-2xl font-black text-white">
                                                    2
                                                </div>
                                            ) : (
                                                <span className="text-zinc-600 font-bold text-xl">2</span>
                                            )}
                                        </div>
                                        <div className="h-1.5 w-8 rounded-full bg-pink-500/50"></div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div
                                    className="w-full md:w-auto md:pl-6 md:border-l border-white/10 flex justify-center">
                                    <button
                                        onClick={handleStartCombat}
                                        disabled={!selectedId1 || !selectedId2 || starting}
                                        className={`
                                            w-full md:w-auto whitespace-nowrap rounded-xl px-8 py-4 font-black text-lg uppercase tracking-wider transition-all duration-300
                                            ${!selectedId1 || !selectedId2 || starting
                                            ? 'cursor-not-allowed bg-zinc-800 text-zinc-600'
                                            : 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/40 hover:scale-105 hover:shadow-purple-700/60 active:scale-95'}
                                        `}
                                    >
                                        {starting ? (
                                            <div
                                                className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                                        ) : (
                                            'COMBATTRE'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="relative">
                            <div
                                className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                        </div>
                    </div>
                ) : monsters.length === 0 ? (
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-16 text-center backdrop-blur-sm">
                        <div className="mb-6 flex justify-center opacity-50">
                            <Ghost className="w-20 h-20"/>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-white">Pas assez de monstres</h3>
                        <p className="text-zinc-400 max-w-md mx-auto mb-8">
                            Vous avez besoin d&#39;au moins 2 monstres pour lancer un combat d&#39;entraînement.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white hover:bg-purple-500 transition-colors"
                        >
                            Aller invoquer
                        </Link>
                    </div>
                ) : (
                    <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-zinc-400">Votre Équipe</span>
                                <span
                                    className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-white">{monsters.length}</span>
                            </h3>

                            {totalPages > 1 && (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                        title="Précédent"
                                    >
                                        <ChevronLeft size={24}/>
                                    </button>
                                    <span className="text-zinc-400 font-medium">
                                        Page {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                        title="Suivant"
                                    >
                                        <ChevronRight size={24}/>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {displayedMonsters.map((monster) => {
                                const isSelected1 = selectedId1 === monster.id;
                                const isSelected2 = selectedId2 === monster.id;
                                const isSelected = isSelected1 || isSelected2;

                                return (
                                    <div
                                        key={monster.id}
                                        onClick={() => handleSelect(monster.id)}
                                        className={`
                                            group relative cursor-pointer transition-all duration-300
                                            ${isSelected
                                            ? 'z-10 scale-105'
                                            : 'hover:scale-102 hover:z-10'
                                        }
                                        `}
                                    >
                                        <div className={`
                                            h-full rounded-3xl transition-all duration-300
                                            ${isSelected1 ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/20' : ''}
                                            ${isSelected2 ? 'ring-4 ring-pink-500 shadow-2xl shadow-pink-500/20' : ''}
                                            ${!isSelected ? 'hover:ring-2 hover:ring-white/20' : ''}
                                        `}>
                                            <MonsterCard monster={monster}/>

                                            {/* Selection Overlay */}
                                            {isSelected && (
                                                <div className={`
                                                    absolute -top-3 -right-3 h-10 w-10 rounded-xl flex items-center justify-center text-xl font-black text-white shadow-lg animate-bounce
                                                    ${isSelected1 ? 'bg-purple-600' : 'bg-pink-600'}
                                                `}>
                                                    {isSelected1 ? '1' : '2'}
                                                </div>
                                            )}

                                            {/* Hover Selection Hint */}
                                            {!isSelected && (selectedId1 || selectedId2) && (
                                                <div
                                                    className="absolute inset-0 rounded-3xl bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <span
                                                        className="font-bold text-white tracking-wider uppercase border border-white/30 px-4 py-2 rounded-lg bg-black/40">
                                                        {!selectedId1 ? 'Sélectionner 1' : !selectedId2 ? 'Sélectionner 2' : 'Remplacer'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

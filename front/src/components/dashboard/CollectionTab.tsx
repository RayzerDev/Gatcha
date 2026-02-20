import React, {useState} from 'react';
import {MonsterGrid} from '@/components/monsters';
import {Monster, Player} from '@/lib/services';
import {ChevronLeft, ChevronRight, Ghost, Layers, Users} from 'lucide-react';

interface CollectionTabProps {
    monsters: Monster[];
    player: Player | null;
    isLoading: boolean;
    deletingId: string | null;
    onUpgradeSkill: (monsterId: string, skillNum: number) => void;
    onDelete: (monsterId: string) => void;
}

export function CollectionTab({
                                  monsters,
                                  player,
                                  isLoading,
                                  deletingId,
                                  onUpgradeSkill,
                                  onDelete
                              }: CollectionTabProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const totalPages = Math.ceil(monsters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedMonsters = monsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div
            className="w-full relative mb-8 overflow-hidden rounded-3xl bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-sm border border-white/5 min-h-125 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 p-4 shadow-xl text-white">
                        <Layers size={32}/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
                            Votre Collection
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2 mr-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronLeft size={20}/>
                            </button>
                            <span className="text-sm font-bold text-zinc-400">
                                    {currentPage} / {totalPages}
                                </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}

                    {player && (
                        <div
                            className="flex items-center gap-2 rounded-xl bg-purple-500/20 border border-purple-500/30 px-6 py-3 text-sm font-bold text-purple-200 backdrop-blur-sm">
                            <Users size={16}/>
                            {player.monsters.length} / {player.maxMonsters}
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-64 animate-pulse rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                        />
                    ))}
                </div>
            ) : monsters.length > 0 ? (
                <MonsterGrid
                    monsters={displayedMonsters}
                    onUpgradeSkill={onUpgradeSkill}
                    onDelete={onDelete}
                    deletingId={deletingId}
                />
            ) : (
                <div
                    className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-16 text-center flex flex-col items-center">
                    <Ghost size={64} className="mb-4 text-zinc-500 opacity-50"/>
                    <h3 className="mb-2 text-xl font-bold text-white">Aucun monstre pour le moment</h3>
                    <p className="text-zinc-400">
                        Ouvrez votre premier pack booster pour commencer votre collection !
                    </p>
                </div>
            )}
        </div>
    );
}

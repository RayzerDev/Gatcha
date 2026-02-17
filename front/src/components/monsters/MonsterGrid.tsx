'use client';

import {useState} from 'react';
import {Monster} from '@/lib/services';
import {MonsterCard} from './MonsterCard';
import {ChevronLeft, ChevronRight, Ghost} from 'lucide-react';

interface MonsterGridProps {
    monsters: Monster[];
    onUpgradeSkill?: (monsterId: string, skillNum: number) => void;
    onDelete?: (monsterId: string) => void;
    deletingId?: string | null;
}

const ITEMS_PER_PAGE = 4;

export function MonsterGrid({monsters, onUpgradeSkill, onDelete, deletingId}: MonsterGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(monsters.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedMonsters = monsters.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (monsters.length === 0) {
        return (
            <div className="rounded-xl bg-zinc-100 p-8 text-center dark:bg-zinc-800 flex flex-col items-center">
                <p className="text-xl text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Ghost size={24}/> Pas de monstres !
                </p>
                <p className="mt-2 text-zinc-400 dark:text-zinc-500">
                    Utilisez le portail d&#39;invocation plus haut !
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                        title="Précédent"
                    >
                        <ChevronLeft size={24}/>
                    </button>
                    <span className="text-zinc-400 font-medium">
                        Page {currentPage} sur {totalPages}
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayedMonsters.map((monster) => (
                    <MonsterCard
                        key={monster.id}
                        monster={monster}
                        onUpgradeSkill={onUpgradeSkill ? (skillNum) => onUpgradeSkill(monster.id, skillNum) : undefined}
                        onDelete={onDelete ? () => onDelete(monster.id) : undefined}
                        isDeleting={deletingId === monster.id}
                    />
                ))}
            </div>
        </div>
    );
}

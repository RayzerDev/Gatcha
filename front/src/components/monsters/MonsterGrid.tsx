'use client';

import { Monster } from '@/lib/services';
import { MonsterCard } from './MonsterCard';

interface MonsterGridProps {
    monsters: Monster[];
    onUpgradeSkill?: (monsterId: string, skillNum: number) => void;
    onDelete?: (monsterId: string) => void;
    deletingId?: string | null;
}

export function MonsterGrid({ monsters, onUpgradeSkill, onDelete, deletingId }: MonsterGridProps) {
    if (monsters.length === 0) {
        return (
            <div className="rounded-xl bg-zinc-100 p-8 text-center dark:bg-zinc-800">
                <p className="text-xl text-zinc-500 dark:text-zinc-400">
                    🎴 Pas de monstres !
                </p>
                <p className="mt-2 text-zinc-400 dark:text-zinc-500">
                    Utilisez le portail d&#39;invocation plus haut !
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {monsters.map((monster) => (
                <MonsterCard
                    key={monster.id}
                    monster={monster}
                    onUpgradeSkill={onUpgradeSkill ? (skillNum) => onUpgradeSkill(monster.id, skillNum) : undefined}
                    onDelete={onDelete ? () => onDelete(monster.id) : undefined}
                    isDeleting={deletingId === monster.id}
                />
            ))}
        </div>
    );
}

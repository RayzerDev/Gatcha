'use client';

import {Monster, Player} from '@/lib/services';
import {useMemo} from 'react';

interface PlayerStatsProps {
    player: Player | null;
    monsters: Monster[];
    isLoading?: boolean;
}

export function PlayerStats({player, monsters, isLoading}: PlayerStatsProps) {
    const stats = useMemo(() => {
        const total = monsters.length;
        if (total === 0) return {fire: 0, water: 0, wind: 0};

        const counts = monsters.reduce((acc, m) => {
            const el = m.element?.toLowerCase() || '';
            if (el === 'fire' || el === 'feu') acc.fire++;
            else if (el === 'water' || el === 'eau') acc.water++;
            else if (el === 'wind' || el === 'vent') acc.wind++;
            return acc;
        }, {fire: 0, water: 0, wind: 0});

        return {
            fire: Math.round((counts.fire / total) * 100),
            water: Math.round((counts.water / total) * 100),
            wind: Math.round((counts.wind / total) * 100)
        };
    }, [monsters]);

    if (isLoading) {
        return (
            <div className="animate-pulse rounded-2xl bg-white p-6 shadow-lg dark:bg-zinc-800">
                <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700"/>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 rounded-lg bg-zinc-200 dark:bg-zinc-700"/>
                    ))}
                </div>
            </div>
        );
    }

    if (!player) return null;

    const expPercent = (player.experience / player.experienceStep) * 100;

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-linear-to-br from-white to-zinc-50 p-6 shadow-xl dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700">
            {/* Effet de fond décoratif */}
            <div
                className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"/>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-pink-600 shadow-lg">
                            <span className="text-xl">👤</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {player.username}
                            </h2>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span
                            className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-5 py-2 text-lg font-bold text-white shadow-lg">
                            Lvl. {player.level}
                        </span>
                    </div>
                </div>

                {/* Barre d'XP améliorée */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                        <span className="flex items-center gap-1">
                            <span className="text-sm">⭐</span>
                            Experience
                        </span>
                        <span className="font-bold">
                            {Math.floor(player.experience)} / {Math.floor(player.experienceStep)} XP
                        </span>
                    </div>
                    <div
                        className="relative h-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 shadow-inner">
                        <div
                            className="h-full bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 ease-out relative overflow-hidden"
                            style={{width: `${Math.min(expPercent, 100)}%`}}
                        >
                            <div
                                className="absolute inset-0 animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent"/>
                        </div>
                    </div>
                    <div className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-400">
                        {Math.floor(expPercent)}% du prochain niveau
                    </div>
                </div>

                {/* Stats améliorées */}
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className="group relative overflow-hidden rounded-xl bg-linear-to-br from-purple-50 to-pink-50 p-4 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 transition-all hover:scale-105 hover:shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">🎴</span>
                            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Collection</span>
                        </div>
                        <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                            {monsters.length}<span className="text-lg text-zinc-500">/{player.maxMonsters}</span>
                        </p>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {monsters.length === player.maxMonsters ? 'Plein !' : `${player.maxMonsters - monsters.length} places restantes`}
                        </div>
                    </div>

                    <div
                        className="group relative overflow-hidden rounded-xl bg-linear-to-br from-blue-50 to-cyan-50 p-4 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 transition-all hover:scale-105 hover:shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">📊</span>
                            <span
                                className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Répartition</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-center">
                                <div className="text-red-500 font-bold">🔥 {stats.fire}%</div>
                                <div className="text-[10px] text-zinc-500">Feu</div>
                            </div>
                            <div className="text-center">
                                <div className="text-blue-500 font-bold">💧 {stats.water}%</div>
                                <div className="text-[10px] text-zinc-500">Eau</div>
                            </div>
                            <div className="text-center">
                                <div className="text-green-500 font-bold">🌪️ {stats.wind}%</div>
                                <div className="text-[10px] text-zinc-500">Vent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

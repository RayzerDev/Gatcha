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
            className="w-full bg-zinc-900/80 border-b border-zinc-800/50 backdrop-blur-md flex flex-row items-center justify-between px-4 py-2 gap-4">
            {/* Gauche: Info Joueur Compacte */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="relative shrink-0">
                    <div
                        className="h-8 w-8 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm shadow-inner ring-1 ring-purple-400/30">
                        👤
                    </div>
                    <div
                        className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full px-1 py-px ring-1 ring-zinc-700 text-[9px] font-bold text-white">
                        {player.level}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="font-bold text-white text-sm leading-none flex items-center gap-2">
                        {player.username}
                        <span className="text-[10px] text-zinc-500 font-normal">XP {Math.floor(expPercent)}%</span>
                    </div>
                    <div className="w-24 h-1 mt-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-purple-500 to-indigo-500"
                            style={{width: `${Math.min(expPercent, 100)}%`}}
                        />
                    </div>
                </div>
            </div>

            {/* Droite: Stats Compactes */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">

                {/* Collection */}
                <div
                    className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-zinc-800/30 rounded-full border border-zinc-700/30">
                    <span className="text-sm">🎴</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-white">{monsters.length}</span>
                        <span className="text-[10px] text-zinc-500">/{player.maxMonsters}</span>
                    </div>
                </div>

                {/* Éléments (Mini badges) */}
                <div className="hidden md:flex items-center gap-1">
                    {stats.fire > 0 && (
                        <div
                            className="h-6 px-1.5 rounded-full bg-red-900/20 border border-red-500/20 flex items-center justify-center"
                            title="Feu">
                            <span className="text-xs">🔥 {stats.fire}%</span>
                        </div>
                    )}
                    {stats.water > 0 && (
                        <div
                            className="h-6 px-1.5 rounded-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center"
                            title="Eau">
                            <span className="text-xs">💧 {stats.water}%</span>
                        </div>
                    )}
                    {stats.wind > 0 && (
                        <div
                            className="h-6 px-1.5 rounded-full bg-green-900/20 border border-green-500/20 flex items-center justify-center"
                            title="Vent">
                            <span className="text-xs">🍃 {stats.wind}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

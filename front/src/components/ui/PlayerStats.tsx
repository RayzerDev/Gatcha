'use client';

import {Monster, Player} from '@/lib/services';
import {useMemo} from 'react';
import {Droplets, Flame, Layers, User, Wind} from 'lucide-react';

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

    const expPercent = Math.min(100, (player.experience / player.experienceStep) * 100);

    return (
        <div className="w-full rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Section Joueur & Niveau */}
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="relative">
                        <div
                            className="h-20 w-20 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20 flex items-center justify-center ring-4 ring-black/20">
                            <User className="text-white drop-shadow-md" size={40}/>
                        </div>
                        <div
                            className="absolute -bottom-3 -right-3 h-10 w-10 bg-zinc-950 rounded-xl border-2 border-zinc-800 flex items-center justify-center shadow-lg shadow-black/30">
                            <span className="text-white font-black text-sm">{player.level}</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-2 min-w-50">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">{player.username}</h2>
                            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Maître des
                                Monstres</p>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-zinc-500">
                                <span>EXP</span>
                                <span>{Math.floor(expPercent)}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden ring-1 ring-white/5">
                                <div
                                    className="h-full bg-linear-to-r from-purple-500 via-indigo-500 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out"
                                    style={{width: `${expPercent}%`}}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Stats & Collection */}
                <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">

                    {/* Carte Collection */}
                    <div
                        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-800/30 border border-white/5 hover:bg-zinc-800/50 transition-colors">
                        <div className="p-2 rounded-lg bg-zinc-700/50 text-purple-400">
                            <Layers size={20}/>
                        </div>
                        <div
                            className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1"><span
                            className="text-2xl font-bold text-white leading-none">{monsters.length}</span> Monstres
                        </div>
                    </div>

                    {/* Stats Élémentaires */}
                    <div className="flex gap-2">
                        <div
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20">
                            <Flame size={18} className="text-red-500 mb-1"/>
                            <span className="text-xs font-bold text-red-200">{stats.fire}%</span>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Droplets size={18} className="text-blue-500 mb-1"/>
                            <span className="text-xs font-bold text-blue-200">{stats.water}%</span>
                        </div>
                        <div
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-green-500/10 border border-green-500/20">
                            <Wind size={18} className="text-green-500 mb-1"/>
                            <span className="text-xs font-bold text-green-200">{stats.wind}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

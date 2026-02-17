import React from 'react';
import {MonsterGrid} from '@/components/monsters';
import {Monster, Player} from '@/lib/services';
import {Ghost, Layers, Users} from 'lucide-react';

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
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 p-4 shadow-xl text-white">
                        <Layers size={32}/>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white drop-shadow-lg flex items-center gap-2">
                            Votre Collection
                        </h2>
                        <p className="text-sm text-purple-300">
                            {monsters.length} {monsters.length === 1 ? 'monstre' : 'monstres'} dans votre équipe
                        </p>
                    </div>
                </div>

                {player && (
                    <div
                        className="flex items-center gap-2 rounded-xl bg-purple-500/20 border border-purple-500/30 px-6 py-3 text-sm font-bold text-purple-200 backdrop-blur-sm">
                        <Users size={16}/>
                        {player.monsters.length} / {player.maxMonsters}
                    </div>
                )}
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
                    monsters={monsters}
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


'use client';

import {Monster} from '@/lib/services';

interface MonsterCardProps {
    monster: Monster;
    onUpgradeSkill?: (skillNum: number) => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

const elementColors = {
    fire: 'from-red-500 to-orange-500',
    water: 'from-blue-500 to-cyan-500',
    wind: 'from-green-500 to-emerald-500',
};

const elementIcons = {
    fire: '🔥',
    water: '💧',
    wind: '🌪️',
};

export function MonsterCard({monster, onUpgradeSkill, onDelete, isDeleting}: MonsterCardProps) {
    const expPercent = Math.min(100, Math.max(0, (monster.experience / monster.experienceToNextLevel) * 100));

    return (
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg dark:bg-zinc-800">
            {/* Header avec élément */}
            <div className={`bg-linear-to-r ${elementColors[monster.element]} p-4`}>
                <div className="flex items-center justify-between">
                    <h3 className="mt-2 text-xl font-bold text-white">
                        Monstre #{monster.templateId}
                    </h3>
                    <span className="text-3xl">{elementIcons[monster.element]}</span>
                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">
                        Lvl {monster.level}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="p-4">
                {/* Barre d'XP */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>XP</span>
                        <span>{Math.floor(monster.experience)} / {Math.floor(monster.experienceToNextLevel)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                            className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{width: `${expPercent}%`}}
                        />
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                        <span className="text-red-600 dark:text-red-400">❤️ HP</span>
                        <p className="font-bold text-red-700 dark:text-red-300">{monster.hp}</p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20">
                        <span className="text-orange-600 dark:text-orange-400">⚔️ ATK</span>
                        <p className="font-bold text-orange-700 dark:text-orange-300">{monster.atk}</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                        <span className="text-blue-600 dark:text-blue-400">🛡️ DEF</span>
                        <p className="font-bold text-blue-700 dark:text-blue-300">{monster.def}</p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                        <span className="text-green-600 dark:text-green-400">⚡ VIT</span>
                        <p className="font-bold text-green-700 dark:text-green-300">{monster.vit}</p>
                    </div>
                </div>

                {/* Skill Points */}
                {monster.skillPoints > 0 && (
                    <div className="mt-3 rounded-lg bg-yellow-50 p-2 text-center dark:bg-yellow-900/20">
                        <span className="text-yellow-700 dark:text-yellow-300">
                            ✨ {monster.skillPoints} Point{monster.skillPoints > 1 ? 's' : ''} de compétence
                        </span>
                    </div>
                )}

                {/* Skills */}
                <div className="mt-4">
                    <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Compétences</h4>
                    <div className="space-y-2">
                        {monster.skills.map((skill) => (
                            <div
                                key={skill.num}
                                className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 dark:bg-zinc-700"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-zinc-700 dark:text-zinc-200">
                                            Capacité {skill.num}
                                        </span>
                                        <span className="text-xs text-zinc-500">
                                            Lvl {skill.lvl}/{skill.lvlMax}
                                        </span>
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {skill.dmg} Dégâts • {skill.ratio.percent}% {skill.ratio.stat} •
                                        Recharge: {skill.cooldown}
                                    </div>
                                </div>
                                {onUpgradeSkill && monster.skillPoints > 0 && skill.lvl < skill.lvlMax && (
                                    <button
                                        onClick={() => onUpgradeSkill(skill.num)}
                                        className="ml-2 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-600"
                                    >
                                        +
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete button */}
                {onDelete && (
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="mt-4 w-full rounded-lg bg-red-100 py-2 text-sm font-medium text-red-600 hover:bg-red-200 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                        {isDeleting ? 'Suppression...' : 'Supprimer le monstre'}
                    </button>
                )}
            </div>
        </div>
    );
}

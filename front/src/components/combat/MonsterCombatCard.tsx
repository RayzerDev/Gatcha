'use client';

import { CombatMonsterSnapshot, ElementEnum } from '@/lib/types';
import { motion } from 'framer-motion';

interface MonsterCombatCardProps {
    monster: CombatMonsterSnapshot;
    currentHp: number;
    maxHp: number;
    isAttacking?: boolean;
    isHit?: boolean;
    isDead?: boolean;
    isWinner?: boolean;
}

const elementColors = {
    [ElementEnum.fire]: 'from-red-500 to-orange-600',
    [ElementEnum.water]: 'from-blue-500 to-cyan-600',
    [ElementEnum.wind]: 'from-green-500 to-emerald-600',
};

const elementIcons = {
    [ElementEnum.fire]: '🔥',
    [ElementEnum.water]: '💧',
    [ElementEnum.wind]: '🌪️',
};

export function MonsterCombatCard({
    monster,
    currentHp,
    maxHp,
    isAttacking,
    isHit,
    isDead,
    isWinner
}: MonsterCombatCardProps) {
    const hpPercent = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

    return (
        <motion.div
            className={`relative w-64 rounded-xl bg-white p-4 shadow-xl dark:bg-zinc-800 border-4 ${
                isWinner ? 'border-yellow-400 shadow-yellow-500/50' : 'border-transparent'
            }`}
            animate={{
                x: isAttacking ? [0, 20, 0] : isHit ? [0, -10, 10, -10, 10, 0] : 0,
                opacity: isDead ? 0.5 : 1,
                scale: isWinner ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className={`mb-3 flex items-center justify-between rounded-lg bg-linear-to-r ${elementColors[monster.element]} p-2 text-white`}>
                <div className="font-bold">
                    {monster.element === ElementEnum.fire && '🔥'}
                    {monster.element === ElementEnum.water && '💧'}
                    {monster.element === ElementEnum.wind && '🌪️'}
                    <span className="ml-2">Lvl {monster.level}</span>
                </div>
                <div className="text-xs font-mono opacity-80">#{monster.id.substring(0, 6)}</div>
            </div>

            {/* Monster Avatar Placeholder */}
            <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <span className="text-6xl">
                    {monster.element === ElementEnum.fire && '🐲'}
                    {monster.element === ElementEnum.water && '🦈'}
                    {monster.element === ElementEnum.wind && '🦅'}
                </span>
            </div>

            {/* HP Bar */}
            <div className="mb-2">
                <div className="mb-1 flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    <span>HP</span>
                    <span>{currentHp}/{maxHp}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <motion.div
                        className={`h-full ${
                            hpPercent > 50 ? 'bg-green-500' : hpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{type: "spring", stiffness: 100}}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-zinc-100 p-1 dark:bg-zinc-700">
                    <span className="block font-bold text-orange-600 dark:text-orange-400">ATK</span>
                    {monster.atk}
                </div>
                <div className="rounded bg-zinc-100 p-1 dark:bg-zinc-700">
                    <span className="block font-bold text-blue-600 dark:text-blue-400">DEF</span>
                    {monster.def}
                </div>
                <div className="rounded bg-zinc-100 p-1 dark:bg-zinc-700">
                    <span className="block font-bold text-green-600 dark:text-green-400">VIT</span>
                    {monster.vit}
                </div>
            </div>

            {/* Winner Badge */}
            {isWinner && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-xl shadow-lg"
                >
                    👑
                </motion.div>
            )}
        </motion.div>
    );
}

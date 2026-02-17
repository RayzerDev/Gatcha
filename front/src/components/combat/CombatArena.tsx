'use client';

import { Combat, CombatLog, CombatStatus } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { MonsterCombatCard } from './MonsterCombatCard';

interface CombatArenaProps {
    combat: Combat;
    onReplayEnd?: () => void;
}

export function CombatArena({ combat, onReplayEnd }: CombatArenaProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per turn
    
    // Derived state for monsters HP
    const [m1Hp, setM1Hp] = useState(combat.monster1.hp);
    const [m2Hp, setM2Hp] = useState(combat.monster2.hp);
    const [lastAction, setLastAction] = useState<string | null>(null);

    // Animation states
    const [attackerId, setAttackerId] = useState<string | null>(null);
    const [defenderId, setDefenderId] = useState<string | null>(null);

    useEffect(() => {
        // Reset state on combat change
        setCurrentStep(0);
        setM1Hp(combat.monster1.hp);
        setM2Hp(combat.monster2.hp);
        setIsPlaying(false);
        setLastAction(null);
    }, [combat]);

    // Handle replay logic
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPlaying && currentStep < combat.logs.length) {
            timer = setTimeout(() => {
                const log = combat.logs[currentStep];
                applyLog(log);
                setCurrentStep(prev => prev + 1);
            }, playbackSpeed);
        } else if (isPlaying && currentStep >= combat.logs.length) {
            setIsPlaying(false);
            if (onReplayEnd) onReplayEnd();
        }

        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, combat.logs, playbackSpeed, onReplayEnd]);

    const applyLog = (log: CombatLog) => {
        setAttackerId(log.attackerId);
        setDefenderId(log.defenderId);
        setLastAction(log.description);

        // Update HP based on the log
        // If attacker is m1, then defender is m2 (m2Hp needs update)
        if (log.defenderId === combat.monster1.id) {
            setM1Hp(log.defenderHpRemaining);
        } else {
            setM2Hp(log.defenderHpRemaining);
        }

        // Reset animation flags after a short delay
        setTimeout(() => {
            setAttackerId(null);
            setDefenderId(null);
        }, 300);
    };

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    
    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setM1Hp(combat.monster1.hp);
        setM2Hp(combat.monster2.hp);
        setLastAction(null);
    };

    const handleSkip = () => {
        setIsPlaying(false);
        setCurrentStep(combat.logs.length);
        // Apply final state
        if (combat.logs.length > 0) {
            const lastLog = combat.logs[combat.logs.length - 1];
            // We need to find the last HP for BOTH monsters. 
            // Actually, simply scanning logs is better or just trust the end state provided?
            // The combat object has logs which have HP snapshots.
            // Let's iterate quickly.
            let tempM1Hp = combat.monster1.hp;
            let tempM2Hp = combat.monster2.hp;
            combat.logs.forEach(log => {
                if(log.defenderId === combat.monster1.id) tempM1Hp = log.defenderHpRemaining;
                if(log.defenderId === combat.monster2.id) tempM2Hp = log.defenderHpRemaining;
            });
            setM1Hp(tempM1Hp);
            setM2Hp(tempM2Hp);
        }
    };

    const isEnded = currentStep >= combat.logs.length;
    const winnerId = isEnded ? combat.winnerId : null;

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Arena Display */}
            <div className="relative flex w-full max-w-4xl items-center justify-between rounded-3xl bg-zinc-900/50 p-8 backdrop-blur-sm border-2 border-purple-500/20">
                {/* Monster 1 (Left) */}
                <div className="flex flex-col items-center">
                    <div className="mb-2 text-sm font-bold text-zinc-400">
                        {combat.initiatorUsername}
                    </div>
                    <MonsterCombatCard 
                        monster={combat.monster1}
                        currentHp={m1Hp}
                        maxHp={combat.monster1.hp}
                        isAttacking={attackerId === combat.monster1.id}
                        isHit={defenderId === combat.monster1.id}
                        isDead={m1Hp <= 0}
                        isWinner={winnerId === combat.monster1.id}
                    />
                </div>

                {/* VS / Action Center */}
                <div className="flex flex-col items-center gap-4 px-4 w-64 text-center">
                    <div className="text-4xl font-black italic text-white/20">VS</div>
                    
                    {lastAction && (
                        <div className="rounded-lg bg-black/40 p-3 text-sm font-medium text-yellow-300 animate-fadeIn">
                            {lastAction}
                        </div>
                    )}
                    
                    <div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Tour</div>
                        <div className="text-2xl font-bold text-white">
                            {currentStep > 0 && currentStep <= combat.logs.length 
                             ? combat.logs[currentStep-1].turn 
                             : currentStep === 0 ? 1 : combat.totalTurns}
                        </div>
                    </div>
                </div>

                {/* Monster 2 (Right) */}
                <div className="flex flex-col items-center">
                    <div className="mb-2 text-sm font-bold text-zinc-400">
                        Adversaire
                    </div>
                    <MonsterCombatCard 
                        monster={combat.monster2}
                        currentHp={m2Hp}
                        maxHp={combat.monster2.hp}
                        isAttacking={attackerId === combat.monster2.id}
                        isHit={defenderId === combat.monster2.id}
                        isDead={m2Hp <= 0}
                        isWinner={winnerId === combat.monster2.id}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 rounded-full bg-zinc-800 p-2 shadow-lg">
                <button
                    onClick={handleReset}
                    className="rounded-full p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    title="Reset"
                >
                    ⏪
                </button>
                <button
                    onClick={handlePlayPause}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-xl text-white hover:bg-purple-500 shadow-lg shadow-purple-900/50"
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                    onClick={handleSkip}
                    className="rounded-full p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                    title="Skip to end"
                >
                    ⏩
                </button>
                
                <div className="ml-2 h-8 w-[1px] bg-zinc-700"></div>
                
                <select 
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-transparent text-sm font-medium text-zinc-400 focus:outline-none cursor-pointer"
                >
                    <option value={2000}>x0.5</option>
                    <option value={1000}>x1</option>
                    <option value={500}>x2</option>
                    <option value={100}>x4</option>
                </select>
            </div>

            {/* Logs List */}
            <div className="h-48 w-full max-w-4xl overflow-y-auto rounded-xl bg-black/20 p-4 font-mono text-sm text-zinc-400">
                {combat.logs.slice(0, currentStep).reverse().map((log, i) => (
                    <div key={i} className="mb-1 border-b border-white/5 pb-1 last:border-0">
                        <span className="text-purple-400">[T{log.turn}]</span> {log.description}
                    </div>
                ))}
                {currentStep === 0 && <div className="text-center italic opacity-50">Le combat va commencer...</div>}
            </div>
        </div>
    );
}

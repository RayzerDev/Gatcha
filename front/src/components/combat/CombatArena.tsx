'use client';

import {Combat, CombatLog} from '@/lib/types';
import {useEffect, useState} from 'react';
import {MonsterCombatCard} from './MonsterCombatCard';
import {Pause, Play, RotateCcw, SkipForward, Swords} from 'lucide-react';

interface CombatArenaProps {
    combat: Combat;
    onReplayEnd?: () => void;
}

export function CombatArena({combat, onReplayEnd}: CombatArenaProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per turn

    // Derived state for monsters HP
    const [m1Hp, setM1Hp] = useState(combat.monster1.hp);
    const [m2Hp, setM2Hp] = useState(combat.monster2.hp);

    // Animation states
    const [attackerId, setAttackerId] = useState<string | null>(null);
    const [defenderId, setDefenderId] = useState<string | null>(null);


    // Handle replay logic
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isPlaying && currentStep < combat.logs.length) {
            timer = setTimeout(() => {
                // Determine log
                const log = combat.logs[currentStep];

                // Helper to apply log
                const applyLog = (log: CombatLog) => {
                    setAttackerId(log.attackerId);
                    setDefenderId(log.defenderId);

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

                applyLog(log);
                setCurrentStep(prev => prev + 1);
            }, playbackSpeed);
        } else if (isPlaying && currentStep >= combat.logs.length) {
            // Use setTimeout to avoid synchronous state update warning during render phase
            timer = setTimeout(() => {
                setIsPlaying(false);
                if (onReplayEnd) onReplayEnd();
            }, 0);
        }

        return () => clearTimeout(timer);
    }, [isPlaying, currentStep, combat.logs, playbackSpeed, onReplayEnd, combat.monster1.id]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        setM1Hp(combat.monster1.hp);
        setM2Hp(combat.monster2.hp);
    };

    const handleSkip = () => {
        setIsPlaying(false);
        setCurrentStep(combat.logs.length);
        // Apply final state
        if (combat.logs.length > 0) {
            // We need to find the last HP for BOTH monsters.
            // Actually, simply scanning logs is better or just trust the end state provided?
            // The combat object has logs which have HP snapshots.
            // Let's iterate quickly.
            let tempM1Hp = combat.monster1.hp;
            let tempM2Hp = combat.monster2.hp;
            combat.logs.forEach(log => {
                if (log.defenderId === combat.monster1.id) tempM1Hp = log.defenderHpRemaining;
                if (log.defenderId === combat.monster2.id) tempM2Hp = log.defenderHpRemaining;
            });
            setM1Hp(tempM1Hp);
            setM2Hp(tempM2Hp);
        }
    };

    const isEnded = currentStep >= combat.logs.length;
    const winnerId = isEnded ? combat.winnerId : null;

    return (
        <div className="flex flex-col items-center w-full h-full justify-center">
            {/* Main Layout: Vertical Centered */}
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-2 sm:gap-4 h-full justify-center">

                {/* VISUAL ARENA */}
                <div
                    className="relative w-full rounded-2xl sm:rounded-3xl bg-zinc-900/80 p-2 sm:p-4 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden shrink-0 flex items-center justify-center min-h-0 flex-1">

                    {/* Background Animation/Gradient */}
                    <div
                        className="absolute inset-0 bg-linear-to-br from-purple-900/10 via-zinc-900/50 to-pink-900/10 pointer-events-none"/>

                    <div
                        className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                        {/* Monster 1 (Player) */}
                        <div className="flex flex-col items-center gap-1 sm:gap-2 w-full md:w-auto">
                            <div
                                className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-[10px] sm:text-xs font-bold text-zinc-300 border border-white/5 shadow-inner">
                                {combat.initiatorUsername}
                            </div>
                            <div className="scale-75 sm:scale-90 md:scale-100 origin-center transition-transform">
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
                        </div>

                        {/* Center Action Display */}
                        <div
                            className="flex flex-col items-center justify-center gap-1 sm:gap-2 min-w-20 sm:min-w-30">
                            <div className="relative p-2 sm:p-4">
                                <Swords size={32} className="text-white/20 -rotate-45 sm:w-12 sm:h-12"/>
                                {isPlaying && (
                                    <div
                                        className="absolute inset-0 bg-purple-500/20 blur-xl sm:blur-2xl animate-pulse rounded-full"/>
                                )}
                            </div>

                            <div className="text-center">
                                <div
                                    className="text-[8px] sm:text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mb-0.5">Tour
                                </div>
                                <div
                                    className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tighter">
                                    {currentStep > 0 && currentStep <= combat.logs.length
                                        ? combat.logs[currentStep - 1].turn
                                        : currentStep === 0 ? 1 : combat.totalTurns}
                                </div>
                            </div>
                        </div>

                        {/* Monster 2 (Opponent) */}
                        <div className="flex flex-col items-center gap-1 sm:gap-2 w-full md:w-auto">
                            <div
                                className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-[10px] sm:text-xs font-bold text-zinc-300 border border-white/5 shadow-inner">
                                Adversaire
                            </div>
                            <div className="scale-75 sm:scale-90 md:scale-100 origin-center transition-transform">
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
                    </div>
                </div>

                {/* CONTROLS BAR */}
                <div className="flex justify-center shrink-0 pb-2">
                    <div
                        className="flex items-center gap-2 sm:gap-4 rounded-xl bg-zinc-900/90 p-1.5 sm:p-2 shadow-lg border border-white/10 backdrop-blur-md">
                        <button
                            onClick={handleReset}
                            className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all active:scale-95"
                            title="Réinitialiser"
                        >
                            <RotateCcw size={18} className="sm:w-5.5 sm:h-5.5"/>
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className={`
                                flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl text-white shadow-lg transition-all hover:scale-105 active:scale-95
                                ${isPlaying
                                ? 'bg-zinc-700 hover:bg-zinc-600 shadow-zinc-900/50'
                                : 'bg-linear-to-br from-purple-600 to-pink-600 shadow-purple-900/40 ring-2 ring-purple-400/20'}
                            `}
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" className="sm:w-8 sm:h-8"/> :
                                <Play size={24} fill="currentColor" className="ml-1 sm:w-8 sm:h-8"/>}
                        </button>

                        <button
                            onClick={handleSkip}
                            className="p-2 sm:p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all active:scale-95"
                            title="Aller à la fin"
                        >
                            <SkipForward size={18} className="sm:w-5.5 sm:h-5.5"/>
                        </button>

                        <div className="w-px h-6 sm:h-8 bg-zinc-800"></div>

                        <select
                            value={playbackSpeed}
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="bg-transparent text-xs sm:text-sm font-bold text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer text-right min-w-[60px] sm:min-w-[80px]"
                        >
                            <option value={2000}>x0.5</option>
                            <option value={1000}>x1</option>
                            <option value={500}>x2</option>
                            <option value={100}>MAX</option>
                        </select>
                    </div>
                </div>

                {/* COMBAT LOGS (TERMINAL STYLE) */}
                <div
                    className="w-full flex-1 min-h-0 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md overflow-hidden flex flex-col shadow-inner">
                    <div
                        className="px-4 sm:px-6 py-2 sm:py-3 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div
                                    className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>
                            <span
                                className="ml-3 text-xs font-mono font-bold text-zinc-500 tracking-wider">BATTLE_LOG.TXT</span>
                        </div>
                        <span className="text-xs font-mono text-zinc-600">{currentStep}/{combat.logs.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm custom-scrollbar">
                        {combat.logs.slice(0, currentStep).reverse().map((log, i) => (
                            <div
                                key={currentStep - 1 - i}
                                className={`flex gap-3 animate-fadeInLeft ${i === 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition-opacity'}`}
                            >
                                <span
                                    className="text-zinc-600 w-16 text-right shrink-0">[T{String(log.turn).padStart(2, '0')}]</span>
                                <span className={`
                                    ${log.description.includes("tire") ? 'text-red-400' :
                                    log.description.includes("Soigne") ? 'text-green-400' :
                                        'text-zinc-300'}
                                `}>
                                    {log.description}
                                </span>
                            </div>
                        ))}

                        {currentStep === 0 && (
                            <div
                                className="h-full flex flex-col items-center justify-center text-zinc-600 gap-2 p-8 text-center italic">
                                En attente du lancement de la simulation...
                            </div>
                        )}

                        {isEnded && (
                            <div className="mt-4 p-3 border-t border-dashed border-white/10 text-center">
                                <span className="text-yellow-500 font-bold">&gt;&gt;&gt; SIMULATION TERMINÉE - VAINQUEUR: {winnerId === combat.monster1.id ? combat.initiatorUsername.toUpperCase() : "ADVERSAIRE"}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

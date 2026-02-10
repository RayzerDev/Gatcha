'use client';

import { useState } from 'react';
import { Monster } from '@/lib/services';
import { MonsterCard } from '@/components/monsters';

interface BoosterPackProps {
    onOpen: () => Promise<Monster>;
    onAdd?: (monster: Monster) => void;
    disabled?: boolean;
}

export function BoosterPack({ onOpen, onAdd, disabled }: BoosterPackProps) {
    const [isShaking, setIsShaking] = useState(false);
    const [isTearing, setIsTearing] = useState(false);
    const [isRevealing, setIsRevealing] = useState(false);
    const [revealedMonster, setRevealedMonster] = useState<Monster | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [glowIntensity, setGlowIntensity] = useState(0);
    const [confettiConfig, setConfettiConfig] = useState<{left: number, color: string, delay: number, duration: number}[]>([]);


    const handleClick = async () => {
        if (disabled || isShaking || isTearing) return;

        // Phase 1: Secousse et glow (1s)
        setIsShaking(true);
        setGlowIntensity(1);

        setTimeout(() => {
            setIsShaking(false);
            setIsTearing(true);

            // Phase 2: Déchirement (800ms) puis appel API
            setTimeout(async () => {
                try {
                    const monster = await onOpen();

                    // Phase 3: Révélation avec confettis
                    setTimeout(() => {
                        setRevealedMonster(monster);

                        // Générer les confettis
                        setConfettiConfig(Array.from({ length: 100 }, () => ({
                            left: Math.random() * 100,
                            color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#fbbf24'][
                                Math.floor(Math.random() * 7)
                            ],
                            delay: Math.random() * 0.3,
                            duration: 1 + Math.random() * 1.5,
                        })));

                        setIsRevealing(true);
                        setShowConfetti(true);
                        setIsTearing(false);
                        setGlowIntensity(0);

                        // Masquer les confettis après l'animation
                        setTimeout(() => setShowConfetti(false), 3000);
                    }, 200);
                } catch (error) {
                    console.error('Failed to open pack:', error);
                    setIsShaking(false);
                    setIsTearing(false);
                    setGlowIntensity(0);
                }
            }, 800);
        }, 1000);
    };

    const handleClose = () => {
        if (revealedMonster && onAdd) {
            onAdd(revealedMonster);
        }
        setIsShaking(false);
        setIsTearing(false);
        setIsRevealing(false);
        setRevealedMonster(null);
        setShowConfetti(false);
        setGlowIntensity(0);
    };

    return (
        <>
            {/* Booster Pack avec effet de déchirement */}
            <div className={`flex flex-col items-center justify-center ${isRevealing ? 'invisible h-80' : ''}`}>
                    <div className="relative">
                        {/* Glow effect pulsant pendant la phase de shake */}
                        {glowIntensity > 0 && (
                            <div
                                className="absolute -inset-8 rounded-full blur-3xl transition-opacity duration-300"
                                style={{
                                    background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.4) 50%, transparent 70%)',
                                    opacity: glowIntensity,
                                    animation: 'pulse 0.5s ease-in-out infinite',
                                }}
                            />
                        )}

                        <button
                            onClick={handleClick}
                            disabled={disabled || isShaking || isTearing}
                            className={`relative transition-all duration-300 ${
                                isShaking ? 'animate-[shake_0.5s_ease-in-out_infinite]' : 'hover:scale-105'
                            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {/* Booster Pack */}
                            <div className="relative h-80 w-56 perspective-1000">
                                {/* Effet de déchirement - Partie gauche */}
                                <div
                                    className={`absolute inset-0 origin-left transition-all duration-700 ${
                                        isTearing ? 'tear-left' : ''
                                    }`}
                                    style={{
                                        clipPath: isTearing ? 'polygon(0 0, 45% 0, 40% 100%, 0 100%)' : 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                                        transform: isTearing ? 'translateX(-120%) rotateY(-60deg)' : 'translateX(0) rotateY(0)',
                                        opacity: isTearing ? 0 : 1,
                                    }}
                                >
                                    <div className="h-full w-full rounded-l-2xl border-4 border-r-2 border-white/30 bg-linear-to-br from-purple-700 via-pink-700 to-red-700 p-6 backdrop-blur-sm shadow-2xl">
                                        <div className="flex h-full flex-col items-center justify-center">
                                            <div className="text-6xl animate-float">✨</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Effet de déchirement - Partie droite */}
                                <div
                                    className={`absolute inset-0 origin-right transition-all duration-700 ${
                                        isTearing ? 'tear-right' : ''
                                    }`}
                                    style={{
                                        clipPath: isTearing ? 'polygon(55% 0, 100% 0, 100% 100%, 60% 100%)' : 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                                        transform: isTearing ? 'translateX(120%) rotateY(60deg)' : 'translateX(0) rotateY(0)',
                                        opacity: isTearing ? 0 : 1,
                                    }}
                                >
                                    <div className="h-full w-full rounded-r-2xl border-4 border-l-2 border-white/30 bg-linear-to-br from-purple-700 via-pink-700 to-red-700 p-6 backdrop-blur-sm shadow-2xl">
                                        <div className="flex h-full flex-col items-center justify-center">
                                            <div className="text-xl font-bold text-yellow-300">PACK</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Centre du pack (toujours visible) */}
                                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
                                    isTearing ? 'opacity-0' : 'opacity-100'
                                }`}>
                                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-700 via-pink-700 to-red-700 border-4 border-white/30 backdrop-blur-sm shadow-2xl">
                                        {/* Shine effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                        {/* Logo/Icon */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="mb-4 text-7xl animate-float">✨</div>

                                            {/* Title */}
                                            <div className="mb-2 text-center">
                                                <h3 className="text-2xl font-black text-white drop-shadow-lg">
                                                    MONSTRE
                                                </h3>
                                                <h4 className="text-xl font-bold text-yellow-300 drop-shadow-lg">
                                                    PACK
                                                </h4>
                                            </div>

                                            {/* Decorative elements */}
                                            <div className="mt-4 flex gap-2">
                                                <div className="h-2 w-2 rounded-full bg-white/50" />
                                                <div className="h-2 w-2 rounded-full bg-white/50" />
                                                <div className="h-2 w-2 rounded-full bg-white/50" />
                                            </div>

                                            {/* Rarity indicator */}
                                            <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-black/30 px-3 py-2 text-center backdrop-blur-sm">
                                                <p className="text-xs font-bold text-yellow-300">
                                                    ÉDITION PREMIUM
                                                </p>
                                            </div>
                                        </div>

                                        {/* Glow effect */}
                                        <div className={`absolute -inset-2 -z-10 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-red-500 blur-xl transition-opacity ${
                                            isShaking ? 'opacity-100 animate-pulse' : 'opacity-50 group-hover:opacity-75'
                                        }`} />
                                    </div>
                                </div>
                            </div>

                            {/* Instruction text */}
                            {!disabled && !isShaking && !isTearing && (
                                <p className="mt-6 text-center text-sm font-medium text-white/80 animate-pulse">
                                    Cliquez pour invoquer un monstre ! 🎁
                                </p>
                            )}

                            {/* Status text */}
                            {isShaking && (
                                <p className="mt-6 text-center text-sm font-bold text-yellow-300 animate-pulse">
                                    ✨ Canalisation de l&#39;énergie... ✨
                                </p>
                            )}
                            {isTearing && (
                                <p className="mt-6 text-center text-sm font-bold text-pink-300 animate-pulse">
                                    💥 DÉCHIREMENT EN COURS ! 💥
                                </p>
                            )}
                        </button>
                    </div>
            </div>

            {/* Revealed Monster Card - Full screen overlay */}
            {isRevealing && revealedMonster && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                     style={{
                         position: 'fixed',
                         top: 0,
                         left: 0,
                         right: 0,
                         bottom: 0,
                     }}
                >
                    {/* Confetti effect */}
                    {showConfetti && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {confettiConfig.map((conf, i) => (
                                <div
                                    key={i}
                                    className="absolute h-3 w-3 animate-confetti"
                                    style={{
                                        left: `${conf.left}%`,
                                        top: '-10%',
                                        backgroundColor: conf.color,
                                        animationDelay: `${conf.delay}s`,
                                        animationDuration: `${conf.duration}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Monster Card - Centré et responsive */}
                    <div className="relative w-full max-w-sm animate-[revealCard_0.8s_ease-out] flex flex-col gap-4">
                        <MonsterCard monster={revealedMonster} />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="w-full rounded-xl bg-linear-to-r from-purple-600 to-pink-600 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                        >
                            Ajouter à la collection ✨
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}


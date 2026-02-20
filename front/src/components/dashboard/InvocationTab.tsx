import React, {useState} from 'react';
import {createPortal} from 'react-dom';
import {AlertTriangle, BarChart3, ChevronLeft, ChevronRight, RefreshCw, X} from 'lucide-react';
import {BoosterPack} from '@/components/BoosterPack';
import {TemplateList} from '@/components/invocation/TemplateList';
import {Monster, MonsterTemplate, Player} from '@/lib/services';

interface InvocationTabProps {
    canSummon: boolean;
    hasPendingInvocations: boolean;
    isRetrying: boolean;
    player: Player | null;
    templates: MonsterTemplate[];
    onSummon: () => Promise<Monster>;
    onCollectionUpdate: (monster: Monster) => void;
    onRetryInvocations: () => void;
    onRefreshTemplates: () => void;
}

export function InvocationTab({
                                  canSummon,
                                  hasPendingInvocations,
                                  isRetrying,
                                  player,
                                  templates,
                                  onSummon,
                                  onCollectionUpdate,
                                  onRetryInvocations,
                                  onRefreshTemplates
                              }: InvocationTabProps) {
    const [showDropRates, setShowDropRates] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const totalPages = Math.ceil(templates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedTemplates = templates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Générer les particules une seule fois
    const [particles] = useState(() =>
        Array.from({length: 30}, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
        }))
    );

    return (
        <div
            className="w-full relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 p-8 shadow-2xl backdrop-blur-sm border border-purple-500/20 min-h-125 flex flex-col justify-center">
            {/* Effet de particules d'arrière-plan */}
            <div className="absolute inset-0 opacity-20">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-purple-400 animate-float"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* Bouton Info Taux de drop */}
            <button
                onClick={() => setShowDropRates(true)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-20 group"
                title="Voir les taux de drop"
            >
                <span className="sr-only">Voir les taux</span>
                <BarChart3 className="w-6 h-6 group-hover:animate-pulse"/>
            </button>

            <div className="relative z-10">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-4xl font-black text-white drop-shadow-lg flex justify-center items-center gap-3">
                        Portail d&#39;Invocation
                    </h2>
                    <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                        Cliquez sur le pack booster pour invoquer une créature puissante !
                    </p>
                </div>

                {/* Booster Pack Component */}
                <div className="flex justify-center mb-8">
                    <BoosterPack
                        onOpen={onSummon}
                        onAdd={onCollectionUpdate}
                        disabled={!canSummon || hasPendingInvocations}
                    />
                </div>

                {/* Statistiques et avertissements */}
                <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
                    {/* Bouton pour réessayer les invocations échouées */}
                    {hasPendingInvocations && canSummon && (
                        <div
                            className="w-full rounded-xl bg-purple-500/20 border border-purple-500/40 px-6 py-4 backdrop-blur-sm animate-pulse flex items-center justify-between gap-4">
                            <p className="text-sm font-bold text-purple-300 flex items-center gap-3">
                                <RefreshCw className="w-6 h-6 animate-spin"/>
                                <span>Des invocations incomplètes ont été détectées.</span>
                            </p>
                            <button
                                onClick={onRetryInvocations}
                                disabled={isRetrying || !canSummon}
                                className={`shrink-0 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white transition-colors shadow-lg hover:shadow-purple-500/20 ${
                                    isRetrying || !canSummon ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                                }`}
                            >
                                {isRetrying ? 'Traitement...' : 'Récupérer'}
                            </button>
                        </div>
                    )}

                    {/* Avertissement si inventaire plein */}
                    {!canSummon && player && (
                        <div
                            className="rounded-xl bg-orange-500/20 border border-orange-500/40 px-8 py-4 backdrop-blur-sm animate-pulse">
                            <p className="text-sm font-bold text-orange-300 flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6"/>
                                <span>L&#39;inventaire de monstres est plein ({player.monsters.length}/{player.maxMonsters}) ! Libérez un monstre pour en invoquer d&#39;autres.</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Modal Taux de Drop */}
                {showDropRates && typeof document !== 'undefined' && createPortal(
                    <div
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div
                            className="relative w-full max-w-2xl bg-zinc-900/95 rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-400"/>
                                    Taux d&#39;invocation
                                </h3>

                                <div className="flex items-center gap-4">
                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center gap-2 mr-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-1 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                            >
                                                <ChevronLeft size={16}/>
                                            </button>
                                            <span className="text-xs font-bold text-zinc-400">
                                                {currentPage} / {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-1 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                                            >
                                                <ChevronRight size={16}/>
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowDropRates(false)}
                                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <X size={24}/>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto p-4 custom-scrollbar">
                                <TemplateList
                                    allTemplates={templates}
                                    displayedTemplates={displayedTemplates}
                                    onRefresh={onRefreshTemplates}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
}
